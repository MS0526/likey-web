import express, { Request, Response } from 'express';
import cors from 'cors';
import itemRouter from './routes/itemRoutes'; // 👈 1. 라우터 파일 import 추가

const app = express();
const PORT = 5000;

// 1. 프론트엔드(Vite, 5173 포트) 접근 허용 (CORS)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// 2. JSON 요청 Body 파싱
app.use(express.json());

// 3. 백엔드 루트 경로 (http://localhost:5000/ 접속 시 표시)
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 LIKEY 백엔드 API 서버가 정상적으로 실행 중입니다!');
});

// 4. 프론트엔드 통신 테스트용 API 엔드포인트
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    message: '🎉 백엔드 서버 연결 성공!',
    status: 'success' 
  });
});

// 👇 5. 마켓/기관/요청 관련 API 라우터 연결 (이 부분이 핵심!)
app.use('/api', itemRouter);

// 6. 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 running 중: http://localhost:${PORT}`);
});