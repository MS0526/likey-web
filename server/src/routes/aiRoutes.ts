import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// POST /api/ai/recommend
router.post('/recommend', async (req: Request, res: Response) => {
  if (!openai) {
    return res.status(503).json({
      success: false,
      code: 'missing_api_key',
      message: 'AI 추천 기능이 설정되지 않았습니다 (OPENAI_API_KEY 누락)',
    });
  }

  try {
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: prompt
            ? `"${prompt}" — 이 요청에 맞게, 예산 ${budget}원 안에서 물품을 추천해줘.`
            : `예산 ${budget}원으로 가장 필요한 물품을 추천해줘.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    // 옵셔널 체이닝(?. )을 사용해 undefined 에러 방지
    const content = completion.choices[0]?.message?.content;
    const result = content ? JSON.parse(content) : {};

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI Recommend Error:', error);
    return res.status(500).json({ error: 'AI 추천 생성 중 오류가 발생했습니다.' });
  }
});

export default router;