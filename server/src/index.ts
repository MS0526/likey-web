import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 테스트용 API (헬스체크)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'LIKEY 백엔드 서버가 정상 작동 중입니다.' });
});

app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});