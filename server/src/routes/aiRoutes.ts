import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// OpenAI 응답이 안 오면 기본적으로 무한정 대기하므로, 클라이언트 단에서 25초 타임아웃을 건다.
// (프론트의 30초 타임아웃보다 짧게 잡아, 서버가 먼저 정리하고 상황을 알려줄 수 있게 한다)
const OPENAI_TIMEOUT_MS = 25_000;

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: OPENAI_TIMEOUT_MS });
}

class UpstreamTimeoutError extends Error {}

/**
 * DNS/커넥션 단계에서 멈추는 경우 OpenAI SDK 자체 timeout이 못 잡아낼 수 있어,
 * 라우트 핸들러가 절대 OPENAI_TIMEOUT_MS를 넘겨 응답을 붙들고 있지 않도록 이중으로 막는다.
 * 늦게 도착하는 원래 promise는 무시하되, unhandled rejection 경고가 안 나게 미리 잡아둔다.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  promise.catch(() => {});
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new UpstreamTimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/** system/user 프롬프트로 OpenAI를 호출해 JSON을 파싱해 응답한다. 두 추천 라우트가 공유한다. */
async function respondWithCompletion(
  res: Response,
  systemPrompt: string,
  userMessage: string
) {
  if (!openai) {
    return res.status(503).json({
      success: false,
      code: 'missing_api_key',
      message: 'AI 추천 기능이 설정되지 않았습니다 (OPENAI_API_KEY 누락)',
    });
  }

  try {
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      OPENAI_TIMEOUT_MS
    );

    // 옵셔널 체이닝(?. )을 사용해 undefined 에러 방지
    const content = completion.choices[0]?.message?.content;
    const result = content ? JSON.parse(content) : {};

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof OpenAI.APIConnectionTimeoutError || error instanceof UpstreamTimeoutError) {
      console.error(`AI Recommend Timeout: OpenAI가 ${OPENAI_TIMEOUT_MS}ms 안에 응답하지 않았습니다.`, error);
      return res.status(504).json({
        success: false,
        code: 'upstream_timeout',
        message: 'AI 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.',
      });
    }

    console.error('AI Recommend Error:', error);
    const err = error as { code?: string };
    return res.status(500).json({
      success: false,
      code: err?.code ?? 'unknown',
      message: '추천을 생성하지 못했습니다',
    });
  }
}

// POST /api/ai/recommend
router.post('/recommend', async (req: Request, res: Response) => {
  const { budget, prompt, requests } = req.body;

  const systemPrompt = `
너는 기부/후원 물품 추천 AI 도우미야.
사용자의 예산(${budget}원)과 요청사항("${prompt || '가장 필요한 물품 추천'}")을 바탕으로 기부 물품을 추천해줘.

[엄격한 제약조건]
1. 반드시 아래 제공된 [후원 요청 목록]의 requestId만 사용해야 해. 없는 requestId를 지어내면 안 돼.
2. 추천된 물품들의 총 금액(price * qty의 합)은 사용자의 예산(${budget}원)을 초과할 수 없어.
3. 각 물품의 수량(qty)은 해당 요청의 남은 수량(remain)을 초과할 수 없어.
4. 사용자 요청사항에 구체적인 키워드나 카테고리(예: 학용품, 상비약 등)가 있다면:
   - 그 카테고리(category)와 일치하는 물품만 추천해. 예산이 남더라도 카테고리가 다른 물품을 끼워 넣지 마.
   - 일치하는 물품이 하나도 없으면 억지로 추천하지 말고 recommendations를 빈 배열로 반환해.
5. 사용자 요청사항이 없거나 막연하면(예: "가장 필요한 물품 추천"), 달성률(percent)이 낮은 순서로 우선 추천해.
6. 아래 [수혜 대상 연령 판단] 규칙에 따라 수혜 대상이 19세 이상 성인으로 파악되면 recommendations를 반드시 빈 배열로 반환해.

[수혜 대상 연령 판단]
라이키는 보육원·아동센터 등 아동·청소년(0~18세)을 위한 후원 플랫폼이야.
반드시 "누가 물품을 받는가"(수혜 대상)를 기준으로 판단해. 후원자 본인의 나이는 무관해.
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

수혜 대상이 19세 이상 성인이면 recommendations는 빈 배열로 반환하고, message에서만 다음 취지로 안내해:
"라이키는 보육원·아동센터 등 아동·청소년 시설 후원 플랫폼이에요. 0~18세 아이들을 위한 물품만 취급하고 있어요."

[후원 요청 목록]
${JSON.stringify(requests, null, 2)}

[응답 포맷]
반드시 다음 JSON 구조로만 응답해야 해:
{
  "message": "사용자에게 보여줄 따뜻한 한 문장 요약",
  "recommendations": [
    {
      "requestId": "해당 요청의 ID",
      "qty": 1,
      "reason": "이 물품을 추천한 짧은 이유 (한 줄)"
    }
  ]
}
`;

  const userMessage = prompt
    ? `"${prompt}" — 이 요청에 맞게, 예산 ${budget}원 안에서 물품을 추천해줘.`
    : `예산 ${budget}원으로 가장 필요한 물품을 추천해줘.`;

  return respondWithCompletion(res, systemPrompt, userMessage);
});

// POST /api/ai/org-recommend
router.post('/org-recommend', async (req: Request, res: Response) => {
  const { candidates } = req.body;

  const systemPrompt = `
너는 아동·청소년 후원 플랫폼 라이키에서, 기관에게 "다음에 어떤 물품을 요청하면 좋을지" 추천하는 AI 도우미야.

[추천 후보 물품 목록]
${JSON.stringify(candidates, null, 2)}

각 후보에는 이미 계산이 끝난 필드가 붙어 있어:
- isNewCategory: true면 이 기관이 이 카테고리(category) 물품을 지금까지 한 번도 요청·후원받은 적이 없다는 뜻이야.
- popularityRank: 전체 플랫폼에서 실제로 많이 후원(수령)된 순위야. 1위가 가장 많이 후원된 물품이고, null이면 순위권 밖(거의 후원된 적 없음)이라는 뜻이야.

[엄격한 제약조건]
1. 반드시 위 [추천 후보 물품 목록]에 있는 itemId만 사용해. 목록에 없는 itemId를 지어내면 안 돼 — 이 목록은 이미 이 기관이 요청 중인 물품을 제외하고 만들어졌어.
2. 최대 3개까지 골라 추천해. isNewCategory가 true인 후보와 popularityRank가 낮은 숫자(1위에 가까움)인 후보를 우선적으로 고려해.
3. 이유는 반드시 그 물품 자신의 필드 값만 그대로 옮겨서 써 — 다른 물품이나 다른 카테고리 얘기를 섞지 마.
   - isNewCategory가 true인 경우에만 "이 카테고리 요청이 없었다"는 취지로 써. false면 그렇게 쓰면 안 돼.
   - popularityRank가 숫자인 경우에만 "N위"라고 정확히 그 숫자를 인용해서 인기 물품이라고 써. null이면 인기 순위를 언급하지 마.
   - 두 필드 다 해당 안 되면(isNewCategory false, popularityRank null) "요청 목록에 추가해볼 만한 물품"처럼 담백하게만 써.
4. 같은 문장을 여러 추천에 복사해서 쓰지 마 — 물품마다 필드 값이 다르면 이유 문장도 달라야 해.
5. 추천할 만한 후보가 정말 없으면 recommendations를 빈 배열로 반환해.

[응답 포맷]
반드시 다음 JSON 구조로만 응답해야 해:
{
  "message": "기관 담당자에게 보여줄 한 문장 요약",
  "recommendations": [
    {
      "itemId": "해당 물품의 ID",
      "reason": "이 물품을 추천한 짧은 이유 (한 줄, 데이터 근거 포함)"
    }
  ]
}
`;

  const userMessage = '지금까지의 요청·후원 이력과 전체 인기 물품 데이터를 바탕으로, 다음에 요청하면 좋을 물품을 추천해줘.';

  return respondWithCompletion(res, systemPrompt, userMessage);
});

export default router;