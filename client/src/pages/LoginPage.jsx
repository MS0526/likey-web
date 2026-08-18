// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/Container';

const isSafeNext = (path) => typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

// 개발용 테스트 계정 안내 (서버 계정과 동일)
const TEST_ACCOUNTS = {
  user: { label: '개인 회원', email: 'user@likey.com', password: 'user1234' },
  org: { label: '기관 회원', email: 'org@likey.com', password: 'org1234' },
};

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const isOrg = role === 'org';
  const testAccount = TEST_ACCOUNTS[role];
  const rawNext = searchParams.get('next');
  const next = isSafeNext(rawNext) ? rawNext : null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요');
      return;
    }

    try {
      const res = await api.post('/api/login', { email, password });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      const { role: serverRole } = res.data.data;
      if (serverRole !== role) {
        setError('해당 회원 유형의 계정이 아닙니다');
        return;
      }

      localStorage.setItem('likeyToken', res.data.token);
      login(serverRole);
      navigate(serverRole === 'org' ? '/org' : (next ?? '/market'));
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('서버에 연결할 수 없습니다');
      }
    }
  };

  const handleGuest = () => {
    login('guest');
    navigate(next ?? '/market');
  };

  return (
    <Container className="py-8">
      <div className="mx-auto max-w-md">
      <h1 className="text-2xl text-ink">{isOrg ? '기관 회원 로그인' : '개인 회원 로그인'}</h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm text-subtle">ID</span>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="mt-2 w-full rounded-xl border border-hairline px-4 py-3 focus:border-brand focus:outline-none"
            placeholder="아이디를 입력하세요"
          />
        </label>

        <label className="block">
          <span className="text-sm text-subtle">PASSWORD</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            className="mt-2 w-full rounded-xl border border-hairline px-4 py-3 focus:border-brand focus:outline-none"
            placeholder="비밀번호를 입력하세요"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-brand px-4 py-3 text-white transition hover:bg-brand-dark"
        >
          로그인
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm text-subtle">
        <span>ID/PW를 잊으셨나요?</span>
        <span>아직 회원가입 안 하셨나요?</span>
        <button type="button" onClick={handleGuest} className="underline underline-offset-4 hover:text-ink">
          비회원으로 둘러보기
        </button>
      </div>

      {import.meta.env.DEV && testAccount && (
        <div className="mt-6 rounded-xl bg-hairline p-4 text-xs text-gray-600">
          <p className="font-semibold text-gray-500">테스트 계정 (개발용)</p>
          <button
            type="button"
            onClick={() => {
              setEmail(testAccount.email);
              setPassword(testAccount.password);
              setError(null);
            }}
            className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-left transition hover:bg-gray-50"
          >
            <span className="text-gray-500">{testAccount.label}</span>{' '}
            <span className="font-mono">{testAccount.email}</span>
            {' / '}
            <span className="font-mono">{testAccount.password}</span>
          </button>
        </div>
      )}
      </div>
    </Container>
  );
}
