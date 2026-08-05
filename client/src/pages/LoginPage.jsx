// src/pages/LoginPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      localStorage.setItem('likeyToken', response.data.token);
      localStorage.setItem('likeyUser', JSON.stringify(response.data.data));
      navigate('/market');
    } catch (err) {
      const message = err?.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="mt-2 text-gray-500">
        {role === 'org' ? '기관 회원으로 로그인합니다.' : '개인 회원으로 로그인합니다.'}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none"
            placeholder="example@likey.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand px-4 py-3 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-semibold">테스트 계정</p>
        <p className="mt-2">개인 회원: user@likey.com / user1234</p>
        <p>기관 회원: org@likey.com / org1234</p>
      </div>
    </div>
  );
}
