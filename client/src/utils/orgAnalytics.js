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
