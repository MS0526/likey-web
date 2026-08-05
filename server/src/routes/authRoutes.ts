import { Router, Request, Response } from 'express';

const router = Router();

interface User {
  id: string;
  role: 'user' | 'org';
  email: string;
  password: string;
  name: string;
}

const users: User[] = [
  {
    id: 'user-01',
    role: 'user',
    email: 'user@likey.com',
    password: 'user1234',
    name: '개인 회원',
  },
  {
    id: 'org-01',
    role: 'org',
    email: 'org@likey.com',
    password: 'org1234',
    name: '기관 회원',
  },
];

const sessions = new Map<string, string>();

const createSessionToken = (userId: string) => {
  const token = `${userId}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  sessions.set(token, userId);
  return token;
};

const sanitizeUser = ({ password, ...rest }: User) => rest;

/** POST /api/login */
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: '이메일과 비밀번호를 모두 입력해주세요.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }

  const token = createSessionToken(user.id);
  return res.json({ success: true, data: sanitizeUser(user), token });
});

/** GET /api/me */
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ success: false, message: '로그인되어 있지 않습니다.' });
  }

  const userId = sessions.get(token);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ success: false, message: '세션을 찾을 수 없습니다.' });
  }

  return res.json({ success: true, data: sanitizeUser(user) });
});

export default router;
