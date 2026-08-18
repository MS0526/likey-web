import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Heart, ChevronRight, ArrowDown } from 'lucide-react';
import KoreaMap from '../components/KoreaMap';
import Container from '../components/Container';
import { organizations, getRegionCounts } from '../data/organizations';
import { useDonation } from '../contexts/DonationContext';
import { useAuth } from '../contexts/AuthContext';
import HowItWorks from '../components/HowItWorks';
import AiDemo from '../components/AiDemo';
import AvailableNow from '../components/AvailableNow';
import StatBar from '../components/StarBar';

export default function HomePage() {
  const { requests } = useDonation();
  const { homePath } = useAuth();
  const [serverMessage, setServerMessage] = useState('백엔드 연결 확인 중...');

  useEffect(() => {
    // 백엔드 API 연결 테스트
    api.get('/api/test')
      .then((res) => {
        setServerMessage(res.data.message);
      })
      .catch((err) => {
        console.error('백엔드 연결 에러:', err);
        setServerMessage('❌ 백엔드 서버와 연결할 수 없습니다.');
      });
  }, []);

  const needCount = requests
    .filter((r) => r.status === 'open')
    .reduce((s, r) => s + Math.max(0, r.neededQty - r.receivedQty), 0);

  return (
    <div>
      {/* 🚀 백엔드 연결 상태 확인용 띠 (확인 후 나중에 삭제하셔도 됩니다) */}
      {import.meta.env.DEV && (
        <div className="flex items-center justify-center gap-2 bg-gray-900 px-4 py-1 text-xs text-gray-300">
          <span className="font-semibold text-gray-500">백엔드</span>
          <span>{serverMessage}</span>
        </div>
      )}

      {/* ── 히어로 ── */}
      <section className="min-h-screen bg-night">
        <Container className="flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <Heart size={20} className="fill-accent text-accent" />
            <span className="whitespace-nowrap text-base text-cream">나눔카트</span>
          </div>
          <a href="#available-now" className="flex items-center gap-1 text-sm text-subtle">
            서비스 소개 <ArrowDown size={14} />
          </a>
        </Container>

        <Container className="grid items-center gap-8 pb-16 pt-6 md:grid-cols-2 md:gap-4 lg:gap-6">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs text-cream">
                지금 전국 {organizations.length}개 기관이 도움을 기다립니다
              </span>
            </div>

            <h1 className="text-4xl leading-tight text-cream">
              직접 전하는
              <br />
              <span className="text-accent">진심 어린</span>
              <br />
              후원
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-subtle">
              전국 {organizations.length}개의 기관이
              <br />
              <strong className="text-cream">{needCount}개의 물품</strong>을 필요로 합니다.
              <br />
              마켓에서 물건을 고르면 기관으로 바로 배송됩니다.
            </p>

            <Link
              to={homePath}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-sm text-ink"
            >
              <Heart size={16} className="fill-ink" />
              후원하러 가기
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md lg:max-w-xl">
              <KoreaMap
                markers={organizations}
                regionCounts={getRegionCounts()}
                theme="dark"
              />
            </div>
          </div>
        </Container>
      </section>

      <AiDemo />
      <HowItWorks />
      <AvailableNow />
      <StatBar />
    </div>
  );
}