const KEYWORDS = {
  greeting: ['안녕', '하이', '반가워', '처음', '헬로', 'hi', 'hello'],
  thanks: ['고마워', '감사', '땡큐', 'thanks', '잘 쓸게'],
  help: ['뭐 할 수 있', '어떻게', '도움말', '사용법', '뭐야', '누구'],
};

// TODO: 백엔드 AI 연동 시 이 로컬 의도 분류는 제거하고
//       원문 query를 그대로 전달해 AI가 판단하도록 교체
export function detectIntent(input) {
  if (typeof input !== 'string') return 'unknown';

  const text = input.toLowerCase();

  for (const [intent, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return intent;
    }
  }

  return 'unknown';
}
