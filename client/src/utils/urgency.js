/** 요청 하나의 달성률 (0~100) */
export function progressOf(request) {
  if (!request?.neededQty) return 0;
  return Math.min(100, Math.round((request.receivedQty / request.neededQty) * 100));
}

/** 요청 여러 건의 합산 달성률 — 기관 카드, 마켓 카드에서 사용 */
export function progressOfAll(requests = []) {
  const needed = requests.reduce((s, r) => s + r.neededQty, 0);
  const received = requests.reduce((s, r) => s + r.receivedQty, 0);
  if (!needed) return 0;
  return Math.min(100, Math.round((received / needed) * 100));
}

/** 달성률에서 긴급도를 계산 — 데이터에 저장하지 않는다 */
export function urgencyOf(percent) {
  if (percent < 40) return { key: 'high', label: '긴급' };
  if (percent < 75) return { key: 'mid', label: '보통' };
  return { key: 'low', label: '여유' };
}

/** 긴급도별 Tailwind 클래스 */
export const URGENCY_STYLE = {
  high: 'bg-alert-soft text-alert',
  mid: 'bg-accent-soft text-accent-ink',
  low: 'bg-brand-soft text-brand',
};

/** 가격 표기 */
export const formatWon = (n) => n.toLocaleString('ko-KR');