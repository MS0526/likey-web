export const SLOW_HINT_DELAY_MS = 8000;
export const HARD_TIMEOUT_MS = 30000;
export const SLOW_HINT_TEXT = '서버가 잠에서 깨어나는 중이에요. 조금만 기다려주세요.';
export const TIMEOUT_TEXT = '응답이 늦어지고 있어요. 다시 시도해 주세요.';

/**
 * AI 추천 요청(fetchRecommendation)을 감싸 8초/30초 단계별 UX를 붙여준다.
 * fetchRecommendation 자체는 절대 reject하지 않지만(항상 로컬로 폴백), Render 무료 티어처럼
 * 진짜 응답이 30초 넘게 걸리는 경우까지 마냥 기다리게 두지 않기 위해 여기서 별도로 마감을 둔다.
 *
 * - 8초 경과: onSlow 호출(아직 응답 없음, 로딩은 계속)
 * - 30초 경과 시점까지 응답이 없으면: onTimeout을 호출해 로딩을 풀고 재시도 UI를 띄우게 한 뒤,
 *   내부 요청은 signal로 중단시킨다. 그 이후 늦게 도착하는 응답은 무시한다(재시도 UI를 덮어쓰지 않도록).
 * - 30초 안에 응답이 오면: onSettle(result)을 호출한다.
 *
 * @param {(signal: AbortSignal) => Promise<any>} run
 * @param {{ onSlow?: () => void, onTimeout?: () => void, onSettle?: (result: any) => void }} handlers
 */
export async function runWithTimeoutUX(run, { onSlow, onTimeout, onSettle } = {}) {
  const controller = new AbortController();
  let settled = false;

  const slowTimer = setTimeout(() => onSlow?.(), SLOW_HINT_DELAY_MS);
  const hardTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    controller.abort();
    onTimeout?.();
  }, HARD_TIMEOUT_MS);

  try {
    const result = await run(controller.signal);
    if (settled) return;
    settled = true;
    onSettle?.(result);
  } finally {
    clearTimeout(slowTimer);
    clearTimeout(hardTimer);
  }
}
