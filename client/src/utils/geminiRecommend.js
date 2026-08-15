// 백엔드 /api/ai/recommend가 준비되기 전까지, 프롬프트 검증을 위해
// 프론트에서 Gemini API를 임시로 직접 호출한다. 개발 환경(DEV)에서만 쓰이며
// 백엔드 연동이 끝나면 이 파일과 recommend.js의 Gemini 분기는 제거할 예정이다.
import { items, CATEGORIES } from '../data/items';
import { getOrganizationById } from '../data/organizations';
import { progressOf } from './urgency';

const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
const MAX_PICKS = 3;

const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label ?? key;

/** 열려 있는 요청만 골라 프롬프트에 넣을 압축된 형태로 변환한다. */
function buildContext(requests) {
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
        received: r.receivedQty,
        percent: progressOf(r),
      };
    })
    .filter(Boolean);
}

const AGE_SCOPE_SECTION = `[수혜 대상 연령 판단]
라이키는 보육원·아동센터 등 아동·청소년(0~18세)을 위한 후원 플랫폼입니다.
반드시 "누가 물품을 받는가"(수혜 대상)를 기준으로 판단하세요. 후원자 본인의 나이는 무관합니다.
예) "20대 여성을 위한 후원 물품" → 수혜 대상이 성인 → 범위 밖
    "제가 30대인데 뭘 후원하면 좋을까요" → 후원자 본인 이야기 → 정상 추천
    "중학생 조카 또래 아이들 도와주고 싶어요" → 수혜 대상이 미성년 → 정상 추천

- 지원 범위(0~18세): 영유아, 아기, 유아, 미취학, 어린이, 유치원생, 초등학생, 중학생, 고등학생, 청소년, 학생
  숫자 나이(0살~18살, 0세~18세, 만 나이 포함) 및 한글 숫자(일곱살, 열살, 열다섯살 등) 포함
- 범위 밖(19세 이상 성인): 20대, 30대, 40대, 50대, 중년, 장년, 노인, 성인, 어른, 19살 이상, 스무살 이상

수혜 대상이 미성년자(0~18세)면 연령대에 맞는 물품을 우선 고르세요.
- 영유아·유아(0~6세): 기저귀, 분유, 위생용품, 놀이용품
- 초등학생(7~12세): 학용품, 도서, 의류, 간식
- 중·고등학생(13~18세): 학용품, 참고서, 의류, 위생용품

수혜 대상이 19세 이상 성인이면 recommendations는 빈 배열로 반환하고, message에서만 다음 취지로 안내하세요:
"라이키는 보육원·아동센터 등 아동·청소년 시설 후원 플랫폼이에요. 0~18세 아이들을 위한 물품만 취급하고 있어요."`;

function buildPrompt({ budget, query, context }) {
  const budgetSection =
    budget != null
      ? `[사용자 예산]\n${budget}원`
      : '[사용자 예산]\n(제공되지 않음 — 예산 제약 없이 질문에 가장 잘 맞는 물품을 고르세요)';

  const budgetRule =
    budget != null
      ? `- 추천한 항목들의 (가격 × qty) 합이 예산(${budget}원)을 넘지 않게 하세요.`
      : '- 예산이 없으니 가격 제약 없이 사용자 질문에 가장 잘 맞는 물품을 고르세요.';

  return `당신은 후원 물품을 추천하는 도우미입니다. 아래 후원 요청 목록 중에서만 골라 추천하세요.

[후원 요청 목록 (JSON)]
${JSON.stringify(context)}

${budgetSection}

[사용자 질문]
${query ?? '(없음)'}

${AGE_SCOPE_SECTION}

[규칙]
- requestId는 반드시 위 목록에 있는 값만 사용하세요. 목록에 없는 값을 만들어내지 마세요.
${budgetRule}
- 각 항목의 qty는 needed - received(남은 수량)를 넘지 않게 하세요.
- 최대 ${MAX_PICKS}건까지만 추천하세요.
- 사용자 질문에 특별한 요청이 있으면(예: "아이들이 좋아할 만한 것") 반영해서 고르세요.
- [수혜 대상 연령 판단] 결과 수혜 대상이 19세 이상 성인이면 recommendations는 반드시 빈 배열([])로 반환하세요.
- 반드시 아래 JSON 형식만 반환하세요. 설명 문장이나 마크다운 코드펜스는 포함하지 마세요.

{
  "message": "사용자에게 보여줄 한 문장",
  "recommendations": [
    { "requestId": "req-01", "qty": 1, "reason": "추천 이유 한 줄" }
  ]
}`;
}

/** 응답에 ```json 같은 코드펜스가 섞여 오는 경우를 대비해 제거한다. */
function stripCodeFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
}

/**
 * Gemini에 예산·질문·후원 요청 목록을 보내 추천을 받는다.
 * 실패(네트워크 오류, 형식 오류 등) 시 예외를 던지므로 호출부(recommend.js)에서 폴백 처리한다.
 *
 * @returns {{ message: string, recommendations: { requestId: string, qty: number, reason: string }[] }}
 */
export async function fetchGeminiRecommendation({ budget, query, requests }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.');

  const context = buildContext(requests);
  const prompt = buildPrompt({ budget, query, context });

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (import.meta.env.DEV && !res.ok) {
    const body = await res.clone().text();
    if (res.status === 429) {
      console.warn('[gemini 실패] 무료 티어 rate limit(분당 10회) 초과', res.status, body);
    } else {
      console.warn('[gemini 실패]', res.status, body);
    }
  }

  if (!res.ok) throw new Error(`Gemini API 요청 실패: ${res.status}`);

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini 응답에 내용이 없습니다.');

  let parsed;
  try {
    parsed = JSON.parse(stripCodeFence(text));
  } catch {
    throw new Error('Gemini 응답을 JSON으로 파싱하지 못했습니다.');
  }

  if (!Array.isArray(parsed.recommendations)) {
    throw new Error('Gemini 응답 형식이 올바르지 않습니다.');
  }

  return parsed;
}
