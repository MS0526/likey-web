import { api } from '../lib/api';
import { items, CATEGORIES } from '../data/items';
import { getOrganizationById } from '../data/organizations';
import { progressOf, formatWon } from './urgency';
import { fetchGeminiRecommendation } from './geminiRecommend';

/** 요청 하나의 남은 수량 */
const remainOf = (req) =>
  req.neededQty - req.receivedQty - (req.pendingQty ?? 0);

const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label ?? key;

/** 열려 있는 요청만 골라 백엔드 프롬프트에 넣을 압축된 형태로 변환한다. */
function buildApiContext(requests) {
  return requests
    .filter((r) => r.status === 'open')
    .map((r) => {
      const item = items.find((i) => i.id === r.itemId);
      const org = getOrganizationById(r.orgId);
      if (!item || !org) return null;

      return {
        requestId: r.id,
        name: item.name,
        category: categoryLabel(item.category),
        price: item.price,
        org: org.name,
        needed: r.neededQty,
        remain: remainOf(r),
        percent: progressOf(r),
      };
    })
    .filter(Boolean);
}

/**
 * 서버 응답을 UI가 쓰는 형태로 변환한다.
 * 서버는 requestId만 주므로 프론트에서 기관·물품 정보를 붙인다.
 */
function normalize(data, requests) {
  const picks = (data.recommendations ?? [])
    .map(({ requestId, qty, reason }) => {
      const req = requests.find((r) => r.id === requestId);
      if (!req) return null;
      const item = items.find((i) => i.id === req.itemId);
      if (!item) return null;

      return {
        req,
        item,
        org: getOrganizationById(req.orgId),
        qty: qty ?? 1,
        reason: reason ?? null,
        percent: progressOf(req),
      };
    })
    .filter(Boolean);

  const spent = picks.reduce((sum, p) => sum + p.item.price * p.qty, 0);
  return { message: data.message ?? '', picks, spent };
}

const DEFAULT_BUDGET = 30000;

const ADULT_AGE_KEYWORDS = [
  '20대', '30대', '40대', '50대', '60대', '70대', '80대', '90대',
  '중년', '장년', '노인', '성인', '어른',
];

const MINOR_AGE_KEYWORDS = [
  '영유아', '아기', '유아', '미취학', '어린이',
  '유치원생', '초등학생', '중학생', '고등학생', '청소년', '아동', '학생',
];

const KOREAN_AGE_UNITS = {
  한: 1, 두: 2, 세: 3, 네: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9,
};

const OUT_OF_RANGE_MESSAGE =
  '라이키는 보육원·아동센터 등 아동·청소년 시설 후원 플랫폼이에요.\n0~18세 아이들을 위한 물품만 취급하고 있어요.';

/** "열다섯살", "스무살"처럼 한글로 쓰인 나이를 숫자로 변환한다. 못 찾으면 null. */
function parseKoreanAge(text) {
  const unitPattern = Object.keys(KOREAN_AGE_UNITS).join('|');

  if (/스무살/.test(text)) return 20;

  let m = text.match(new RegExp(`스물(${unitPattern})?살`));
  if (m) return 20 + (m[1] ? KOREAN_AGE_UNITS[m[1]] : 0);

  m = text.match(new RegExp(`열(${unitPattern})?살`));
  if (m) return 10 + (m[1] ? KOREAN_AGE_UNITS[m[1]] : 0);

  m = text.match(new RegExp(`(${unitPattern})살`));
  if (m) return KOREAN_AGE_UNITS[m[1]];

  return null;
}

/** 질문에서 수혜 대상 연령대를 추정한다. 'minor' | 'adult' | null(언급 없음). */
function detectAgeScope(text) {
  if (!text) return null;

  const digitMatch = text.match(/(\d+)\s*(살|세)/);
  if (digitMatch) return Number(digitMatch[1]) <= 18 ? 'minor' : 'adult';

  const koreanAge = parseKoreanAge(text);
  if (koreanAge != null) return koreanAge <= 18 ? 'minor' : 'adult';

  if (ADULT_AGE_KEYWORDS.some((k) => text.includes(k))) return 'adult';
  if (MINOR_AGE_KEYWORDS.some((k) => text.includes(k))) return 'minor';

  return null;
}

/** "제가 30대인데"처럼 후원자 본인 이야기인 경우 나이 언급을 수혜 대상 판단에서 제외한다. */
const isSelfReference = (text) => /제가|저는|나는/.test(text ?? '');

/** Render 무료 티어가 슬립에서 깨는 데 걸리는 시간을 감안한 상한선. */
const REQUEST_TIMEOUT_MS = 30000;

/**
 * 서버가 없을 때 쓰는 로컬 추천.
 * 달성률이 낮은(= 급한) 순으로 예산 안에서 담는다.
 * budget이 없으면(자유 질문에 이전 예산도 없는 경우) 기본 예산으로 계산하고 안내 문구를 덧붙인다.
 * query에서 수혜 대상이 19세 이상 성인으로 파악되면(후원자 본인 언급 제외) 추천 없이 안내만 반환한다.
 */
function localRecommend(budget, requests, query = null, maxPicks = 3) {
  if (!isSelfReference(query) && detectAgeScope(query) === 'adult') {
    return { message: OUT_OF_RANGE_MESSAGE, picks: [], spent: 0 };
  }

  const effectiveBudget = budget ?? DEFAULT_BUDGET;

  const pool = requests
    .filter((r) => r.status === 'open')
    .map((r) => ({ req: r, item: items.find((i) => i.id === r.itemId) }))
    .filter(({ req, item }) => item && remainOf(req) > 0 && item.price <= effectiveBudget)
    .sort((a, b) => progressOf(a.req) - progressOf(b.req));

  const picks = [];
  let rest = effectiveBudget;

  for (const { req, item } of pool) {
    if (picks.length >= maxPicks) break;

    const qty = Math.min(remainOf(req), Math.floor(rest / item.price));
    if (qty < 1) continue;

    picks.push({
      req,
      item,
      org: getOrganizationById(req.orgId),
      qty,
      reason: '지금 가장 달성률이 낮아 급해요',
      percent: progressOf(req),
    });
    rest -= item.price * qty;
  }

  const orgCount = new Set(picks.map((p) => p.org.id)).size;
  let message =
    picks.length === 0
      ? `${formatWon(effectiveBudget)}원으로 후원 가능한 물품이 없어요. 금액을 조금 올려보시겠어요?`
      : orgCount === 1
        ? `${formatWon(effectiveBudget)}원이면 ${picks[0].org.name}에 지금 가장 급한 물품을 보낼 수 있어요.`
        : `${formatWon(effectiveBudget)}원이면 ${orgCount}개 기관에 물품을 보낼 수 있어요.`;

  if (budget == null) {
    message = `예산을 말씀해 주시면 더 정확해요. ${message}`;
  }

  return { message, picks, spent: effectiveBudget - rest };
}

/**
 * 후원 추천을 가져온다. 우선순위:
 * 1. 백엔드 POST /api/ai/recommend
 * 2. (개발 환경 + VITE_GEMINI_API_KEY 설정 시) Gemini 직접 호출
 * 3. 로컬 계산
 * 각 단계가 실패하거나 빈 추천을 반환하면 다음 단계로 폴백한다. 네트워크 요청은 항상
 * 30초 안에 끝나도록 타임아웃이 걸려 있어(끝없이 매달리는 현상 방지) 그 자체로는 폴백을 막지 않는다.
 * 어떤 경로로도 결과를 만들지 못하는 경우(signal 취소 포함)에도 이 함수는 절대 reject하지 않고
 * 반드시 localRecommend 결과를 반환한다 — 호출부가 무한정 기다리는 상황이 없어야 하기 때문이다.
 * 대신 signal이 취소되면(호출부가 30초 넘게 기다리다 포기한 경우) 그 즉시 로컬로 넘어간다.
 * Gemini 직접 호출은 프로덕션 빌드에서는 절대 실행되지 않는다(API 키 노출 방지).
 * budget은 없을 수 있다(예산 없이 자유 질문만 들어온 경우) — 각 단계가 알아서 처리한다.
 *
 * @param {AbortSignal} [signal] 호출부가 넘기면, 취소됐을 때 남은 네트워크 요청을 즉시 정리하고 로컬로 넘어간다.
 * @returns { message, picks, spent, source: 'api' | 'gemini' | 'local' }
 */
export async function fetchRecommendation({ budget = null, query = null, requests, signal }) {
  try {
    try {
      const res = await api.post(
        '/api/ai/recommend',
        { budget, prompt: query, requests: buildApiContext(requests) },
        { timeout: REQUEST_TIMEOUT_MS, signal }
      );
      const data = res.data;
      if (data?.recommendations?.length) {
        return { ...normalize(data, requests), source: 'api' };
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[api 실패]', err.response?.status, err.response?.data);
      }
      // 백엔드 미구현·미기동·타임아웃 → 다음 단계로 폴백
    }

    if (!signal?.aborted && import.meta.env.DEV && import.meta.env.VITE_GEMINI_API_KEY) {
      try {
        const data = await fetchGeminiRecommendation({ budget, query, requests, signal });
        if (data?.recommendations?.length) {
          return { ...normalize(data, requests), source: 'gemini' };
        }
      } catch {
        // Gemini 호출·파싱 실패 → 로컬로 폴백
      }
    }

    return { ...localRecommend(budget, requests, query), source: 'local' };
  } catch {
    // 위 단계들 중 예상치 못한 에러가 나더라도(버그 포함) 호출부는 항상 결과를 받아야 한다.
    return { ...localRecommend(budget, requests, query), source: 'local' };
  }
}