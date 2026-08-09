// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const isSafeNext = (path) => typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

// 백엔드 /api/login 연동 전까지 사용하는 임시 계정. 실제 연동 시 이 상수와 아래 검증 분기를 제거할 것.
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요');
      return;
    }

    // TODO: POST http://localhost:5000/api/login 연동 (email, password 전송 → { success, data: { id, role, email, name }, token } 응답)
    // 성공 시 로컬 검증 대신 서버 응답의 data.role로 login()을 호출하고, token은 저장(localStorage 등) 후 이후 요청에 Authorization: Bearer 헤더로 사용
    if (!testAccount || testAccount.email !== email || testAccount.password !== password) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다');
      return;
    }

    login(role);
    navigate(isOrg ? '/org' : (next ?? '/market'));
  };

  const handleGuest = () => {
    login('guest');
    navigate(next ?? '/market');
  };

  return (
    <div className="mx-auto max-w-md p-8">
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
  );
}
