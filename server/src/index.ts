import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import itemRouter from './routes/itemRoutes';
import authRouter from './routes/authRoutes';
import aiRouter from './routes/aiRoutes'; // 1. AI 라우터 import 추가

const app = express();
// Render, Railway 등 배포 환경에서 주입해주는 동적 PORT 사용 (기본값 5000)
const PORT = process.env.PORT || 5000;

// 1. CORS 설정 (로컬 개발 서버 및 Vercel 배포 주소 허용)
const allowedOrigins = ['https://likey-web.vercel.app'];

app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 없거나(Postman/서버간 요청), 허용 목록에 있거나, vercel 서브도메인이거나,
      // 로컬 개발 서버(포트 무관 — Vite가 5173이 사용 중이면 5174, 5175...로 올라가므로)일 경우 허용
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS 정책에 의해 차단된 요청입니다.'));
      }
    },
    credentials: true,
  })
);

// 2. JSON 요청 Body 파싱
app.use(express.json());

// 3. 백엔드 루트 경로
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 나눔카트 백엔드 API 서버가 정상적으로 실행 중입니다!');
});

// 4. 프론트엔드 통신 테스트용 API 엔드포인트
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    message: '🎉 백엔드 서버 연결 성공!',
    status: 'success' 
  });
});

// 5. API 라우터 연결
app.use('/api', itemRouter);
app.use('/api', authRouter);
app.use('/api/ai', aiRouter); // 2. AI 라우터 연결 (POST /api/ai/recommend 호출 가능)

// 6. 서버 실행 ('0.0.0.0' 바인딩으로 배포 환경 외부 접속 허용)
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 백엔드 서버가 running 중: http://localhost:${PORT}`);
});