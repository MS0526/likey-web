// src/pages/LoginPage.jsx
import { useParams } from 'react-router-dom';

export default function LoginPage() {
  const { role } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">로그인 화면</h1>
      <p className="mt-2 text-gray-500">
        유형: {role === 'org' ? '기관 회원' : '개인 회원'}
      </p>
    </div>
  );
}