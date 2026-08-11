import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai/recommend
router.post('/recommend', async (req: Request, res: Response) => {
  try {
    const { budget, prompt, requests } = req.body;

    const systemPrompt = `
너는 기부/후원 물품 추천 AI 도우미야.
사용자의 예산(${budget}원)과 요청사항("${prompt || '가장 필요한 물품 추천'}")을 바탕으로 기부 물품을 추천해줘.

[엄격한 제약조건]
1. 반드시 아래 제공된 [후원 요청 목록]의 requestId만 사용해야 해. 없는 requestId를 지어내면 안 돼.
2. 추천된 물품들의 총 금액(price * qty의 합)은 사용자의 예산(${budget}원)을 초과할 수 없어.
3. 각 물품의 수량(qty)은 해당 요청의 남은 수량(remain)을 초과할 수 없어.
4. 사용자 요청사항(예: 학용품, 상비약 등) 키워드가 있다면 해당되는 물품을 최우선으로 추천해줘.

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
        { role: 'user', content: `예산 ${budget}원으로 적절한 물품을 추천해줘.` },
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