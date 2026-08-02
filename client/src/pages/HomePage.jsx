import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [serverMessage, setServerMessage] = useState('백엔드 연결 확인 중...');

  useEffect(() => {
    // 백엔드 API 연결 테스트
    axios.get('http://localhost:5000/api/test')
      .then((res) => {
        setServerMessage(res.data.message);
      })
      .catch((err) => {
        console.error('백엔드 연결 에러:', err);
        setServerMessage('❌ 백엔드 서버와 연결할 수 없습니다.');
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">첫 화면</h1>
      <p className="mt-2 text-gray-500">대한민국 전도 + 배너 + 후원하러 가기 버튼</p>

      {/* 🚀 백엔드 연결 상태 확인용 박스 (확인 후 나중에 삭제하셔도 됩니다) */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
        <span className="text-sm font-semibold text-gray-600 block">백엔드 서버 통신 상태:</span>
        <span className="text-base font-bold text-blue-600 mt-1 block">{serverMessage}</span>
      </div>
    </div>
  );
}