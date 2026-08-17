import { api } from '../lib/api';
import { getCategoryLabel } from '../data/items';

const CATEGORY_ORDER = ['food', 'goods', 'toy', 'clothing', 'medicine', 'edu'];

/** 실제로 후원받은(대기 포함) 물품을 카테고리별로 집계해 많이 받은 순으로 정렬한다. */
export function categoryBreakdown(donations, items) {
  const counts = new Map();
  donations.forEach((d) => {
    const item = items.find((i) => i.id === d.itemId);
    if (!item) return;
    counts.set(item.category, (counts.get(item.category) ?? 0) + d.qty);
  });

  return CATEGORY_ORDER
    .map((key) => ({ key, label: getCategoryLabel(key), qty: counts.get(key) ?? 0 }))
    .filter((c) => c.qty > 0)
    .sort((a, b) => b.qty - a.qty);
}

/** 이 기관이 지금까지 한 번이라도 요청했거나 후원받은 카테고리 집합. */
function touchedCategories(orgId, requests, donations, items) {
  const categoryOf = (itemId) => items.find((i) => i.id === itemId)?.category;
  const fromRequests = requests.filter((r) => r.orgId === orgId).map((r) => categoryOf(r.itemId));
  const fromDonations = donations.filter((d) => d.orgId === orgId).map((d) => categoryOf(d.itemId));
  return new Set([...fromRequests, ...fromDonations].filter(Boolean));
}

/**
 * 이 기관이 다음에 요청하면 좋을 물품을 추천한다. 두 신호를 점수화한다:
 * 1) 카테고리 공백 — 이 기관이 지금까지 요청·후원 어느 쪽으로도 접해본 적 없는
 *    카테고리는 새로운 필요를 놓치고 있을 가능성이 커서 가산점을 준다.
 * 2) 플랫폼 수요 — 같은 카테고리를 다른 기관들이 지금 얼마나 많이 열어두고
 *    요청 중인지(open 요청 건수 비중)로, 전반적으로 수요가 있는 물품인지를 반영한다.
 * 이미 이 기관이 열어둔(open) 요청이 있는 물품은 중복 추천하지 않도록 제외한다.
 */
export function recommendNextRequests(orgId, { requests, donations }, items, maxPicks = 3) {
  const openItemIds = new Set(
    requests.filter((r) => r.orgId === orgId && r.status === 'open').map((r) => r.itemId)
  );
  const touched = touchedCategories(orgId, requests, donations, items);

  const openRequests = requests.filter((r) => r.status === 'open');
  const categoryDemand = new Map();
  openRequests.forEach((r) => {
    const category = items.find((i) => i.id === r.itemId)?.category;
    if (!category) return;
    categoryDemand.set(category, (categoryDemand.get(category) ?? 0) + 1);
  });
  const maxDemand = Math.max(1, ...categoryDemand.values());

  return items
    .filter((item) => !openItemIds.has(item.id))
    .map((item) => {
      const isNewCategory = !touched.has(item.category);
      const demandCount = categoryDemand.get(item.category) ?? 0;
      const demandScore = demandCount / maxDemand;
      const score = (isNewCategory ? 2 : 0) + demandScore;

      const reasons = [];
      if (isNewCategory) {
        reasons.push(`지금까지 ${getCategoryLabel(item.category)} 물품 요청이 없었어요`);
      }
      if (demandCount >= 2) {
        reasons.push('다른 기관들도 최근 많이 요청하는 물품이에요');
      }
      if (reasons.length === 0) {
        reasons.push('요청 목록에 추가해볼 만한 물품이에요');
      }

      return { item, score, reason: reasons.join(' · ') };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPicks);
}

/** 전체 플랫폼에서 실제로 많이 후원(수령)된 물품별 순위(1위부터) — status와 무관하게 receivedQty를 합산한다. */
function popularityRanks(requests) {
  const totals = new Map();
  requests.forEach((r) => {
    totals.set(r.itemId, (totals.get(r.itemId) ?? 0) + r.receivedQty);
  });

  const ranks = new Map();
  [...totals.entries()]
    .filter(([, total]) => total > 0)
    .sort((a, b) => b[1] - a[1])
    .forEach(([itemId], i) => ranks.set(itemId, i + 1));

  return ranks;
}

/**
 * AI에게 보낼 추천 후보 목록을 만든다. 이 기관이 이미 열어둔(open) 요청 물품은 제외하고,
 * 후보마다 isNewCategory·popularityRank를 미리 계산해 물품 객체 안에 직접 붙여준다.
 * AI가 "이 카테고리 요청이 없었나?", "몇 위인가?"를 서로 다른 배열을 대조해가며 스스로
 * 계산하게 하면 실제로 틀리는 경우가 많아서(카테고리 착각, 순위 뒤바뀜 등), 각 후보 안에
 * 정답을 미리 박아두고 AI는 그 값을 그대로 문장으로 옮기기만 하면 되게 만든다.
 */
function buildCandidates(orgId, { requests, donations }, items) {
  const openItemIds = new Set(
    requests.filter((r) => r.orgId === orgId && r.status === 'open').map((r) => r.itemId)
  );
  const touched = touchedCategories(orgId, requests, donations, items);
  const ranks = popularityRanks(requests);

  return items
    .filter((item) => !openItemIds.has(item.id))
    .map((item) => ({
      itemId: item.id,
      name: item.name,
      category: getCategoryLabel(item.category),
      isNewCategory: !touched.has(item.category), // true면 이 기관이 이 카테고리를 접해본 적 없음
      popularityRank: ranks.get(item.id) ?? null, // 전체 플랫폼 인기 순위(1위=가장 많이 후원됨), 없으면 순위권 밖
    }));
}

/**
 * 기관의 "다음 요청 추천"을 AI(OpenAI)로 받아온다. 이미 계산된 후보 목록(candidates)을
 * 백엔드로 보내 AI가 그중 최대 3개를 고르고 이유를 문장으로 써주게 한다. 백엔드 호출이
 * 실패하거나(키 미설정, 타임아웃 등) 빈 추천이 오면 규칙 기반 recommendNextRequests로
 * 폴백한다 — fetchRecommendation(recommend.js)과 동일한 폴백 패턴.
 *
 * @returns { message, picks: { item, reason }[], source: 'ai' | 'local' }
 */
export async function fetchNextRequestRecommendation(orgId, { requests, donations }, items, maxPicks = 3) {
  try {
    const res = await api.post('/api/ai/org-recommend', {
      candidates: buildCandidates(orgId, { requests, donations }, items),
    });
    const data = res.data;
    if (data?.recommendations?.length) {
      const picks = data.recommendations
        .map(({ itemId, reason }) => {
          const item = items.find((i) => i.id === itemId);
          return item ? { item, reason: reason ?? '' } : null;
        })
        .filter(Boolean)
        .slice(0, maxPicks);

      if (picks.length > 0) {
        return { message: data.message ?? '', picks, source: 'ai' };
      }
    }
  } catch {
    // 백엔드 미기동·타임아웃·키 미설정 등 → 로컬 규칙 기반으로 폴백
  }

  const localPicks = recommendNextRequests(orgId, { requests, donations }, items, maxPicks);
  return { message: '', picks: localPicks, source: 'local' };
}
