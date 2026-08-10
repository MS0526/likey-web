import { Link } from 'react-router-dom';
import {
  ArrowLeft, Heart, Shield, Sparkles, Store, Camera, Repeat, CreditCard, Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NOW = [
  { Icon: Shield, title: '기관 수락 게이트',
    desc: '결제만으로는 배송되지 않습니다. 등록된 기관이 수락해야 물품이 발송되어 악용을 원천 차단합니다.' },
  { Icon: Heart, title: '마켓형 물품 후원',
    desc: '현금이 아닌 물품을 직접 골라 후원합니다. 어떤 기관에 무엇이 전달되는지 결제 전에 확인할 수 있습니다.' },
  { Icon: Check, title: '실시간 달성률',
    desc: '기관이 요청한 수량 중 얼마나 모였는지 실시간으로 표시됩니다. 이미 충분한 물품은 추가 후원이 제한됩니다.' },
];

const NEXT = [
  { Icon: Sparkles, title: '후원도우미 AI', status: '개발 중',
    desc: '예산만 입력하면 지금 가장 급한 물품 조합을 추천합니다.' },
  { Icon: Camera, title: '수령 인증 피드', status: '기획 완료',
    desc: '기관이 물품을 받은 뒤 사진과 후기를 올려 후원자에게 전달합니다.' },
  { Icon: Store, title: '판매자 회원', status: '준비 중',
    desc: '개인 판매자가 직접 물품을 등록해 후원 마켓에 공급합니다.' },
  { Icon: CreditCard, title: '실제 결제 연동', status: '예정',
    desc: 'PG 연동으로 실제 결제와 거절 시 자동 환불을 처리합니다.' },
  { Icon: Repeat, title: '정기 후원', status: '검토 중',
    desc: '매달 일정 금액으로 자동 후원이 이어지도록 합니다.' },
];

export default function AboutPage() {
  const { homePath } = useAuth();

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between bg-white px-6 py-3">
        <Link to="/" className="flex items-center gap-2 text-sm text-subtle">
          <ArrowLeft size={16} /> 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <Heart size={18} className="fill-brand text-brand" />
          <span className="text-sm text-ink">라이키</span>
        </div>
        <div className="w-16" />
      </header>

      <section className="bg-brand px-6 py-16 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5">
          <Shield size={13} className="text-cream" />
          <span className="text-xs text-cream">기관 인증 시스템으로 안전하게 운영됩니다</span>
        </div>
        <h1 className="text-3xl leading-snug text-white">
          믿을 수 있는 후원,
          <br />
          직접 배송되는 따뜻함
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/75">
          후원하고 싶지만 기관이 미덥지 않았나요? 라이키에서는 물건을 직접 선택해
          검증된 기관으로 바로 배송됩니다.
        </p>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-center text-2xl text-ink">지금 이용할 수 있어요</h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {NOW.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-hairline bg-white p-6">
              <Icon size={24} className="text-brand" />
              <p className="mt-4 text-base text-ink">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <h2 className="text-center text-2xl text-ink">앞으로 이렇게 발전합니다</h2>
        <p className="mt-3 text-center text-sm text-subtle">
          더 정확한 후원과 더 투명한 전달 과정을 준비하고 있습니다
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
          {NEXT.map(({ Icon, title, status, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-xl border border-hairline bg-cream p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <Icon size={18} className="text-accent-ink" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base text-ink">{title}</p>
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-ink">
                    {status}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-subtle">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <p className="text-lg text-ink">지금 바로 시작해 보세요</p>
        <Link
          to={homePath}
          className="mt-6 inline-block rounded-full bg-brand px-8 py-3.5 text-sm text-white"
        >
          후원하러 가기
        </Link>
      </section>
    </div>
  );
}