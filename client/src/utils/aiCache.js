/**
 * AI 호출 결과를 이 브라우저 세션(새로고침 전까지) 동안 메모리에 캐싱한다.
 * 실제 DB/Redis는 없지만(이 프로젝트는 상태 전체가 프론트 메모리 기반), "같은 사용자·같은
 * 조건이면 버튼을 다시 누르기 전엔 API를 새로 호출하지 않는다"는 목표는 이걸로 충분히
 * 달성된다 — OpenAI 무료 티어의 하루 요청 한도(gpt-4o-mini 50회)를 아끼는 게 목적이라,
 * 새로고침하면 초기화되는 것도 이 앱의 다른 모든 상태(후원 내역 등)와 동일해서 자연스럽다.
 *
 * 같은 조건을 다시 물었을 때만 재사용해야 하므로, 실패 후 폴백(local/gemini)한 결과는
 * 절대 캐싱하지 않는다 — 그걸 캐싱하면 다음에 조건이 같을 때 진짜 AI를 다시 시도해볼
 * 기회 자체가 사라져서, 일시적 오류였던 경우에도 영영 로컬 결과만 받게 된다.
 */
const cache = new Map();

export function getCachedAIResult(key) {
  return cache.get(key);
}

export function setCachedAIResult(key, value) {
  cache.set(key, value);
}
