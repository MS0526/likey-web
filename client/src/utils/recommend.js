import { api } from '../lib/api';
import { items } from '../data/items';
import { getOrganizationById } from '../data/organizations';
import { progressOf, formatWon } from './urgency';
import { fetchGeminiRecommendation } from './geminiRecommend';

/** 요청 하나의 남은 수량 */
const remainOf = (req) =>
  req.neededQty - req.receivedQty - (req.pendingQty ?? 0);

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

/**
 * 서버가 없을 때 쓰는 로컬 추천.
 * 달성률이 낮은(= 급한) 순으로 예산 안에서 담는다.
 * budget이 없으면(자유 질문에 이전 예산도 없는 경우) 기본 예산으로 계산하고 안내 문구를 덧붙인다.
 */
function localRecommend(budget, requests, maxPicks = 3) {
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
 * 각 단계가 실패하거나 빈 추천을 반환하면 다음 단계로 폴백한다.
 * Gemini 직접 호출은 프로덕션 빌드에서는 절대 실행되지 않는다(API 키 노출 방지).
 * budget은 없을 수 있다(예산 없이 자유 질문만 들어온 경우) — 각 단계가 알아서 처리한다.
 *
 * @returns { message, picks, spent, source: 'api' | 'gemini' | 'local' }
 */
export async function fetchRecommendation({ budget = null, query = null, requests }) {
  try {
    const res = await api.post('/api/ai/recommend', { budget, query });
    const data = res.data;
    if (data?.recommendations?.length) {
      return { ...normalize(data, requests), source: 'api' };
    }
  } catch {
    // 백엔드 미구현·미기동 → 다음 단계로 폴백
  }

  if (import.meta.env.DEV && import.meta.env.VITE_GEMINI_API_KEY) {
    try {
      const data = await fetchGeminiRecommendation({ budget, query, requests });
      if (data?.recommendations?.length) {
        return { ...normalize(data, requests), source: 'gemini' };
      }
    } catch {
      // Gemini 호출·파싱 실패 → 로컬로 폴백
    }
  }

  return { ...localRecommend(budget, requests), source: 'local' };
}