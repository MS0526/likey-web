import { Shield, Heart, Check, AlertTriangle, Camera, Sparkles } from 'lucide-react';
import Container from './Container';

const FEATURES = [
  { Icon: Shield, title: '기관 수락 게이트',
    desc: '결제만으로는 배송되지 않아요. 등록된 기관이 수락해야 물품이 발송돼요.' },
  { Icon: Heart, title: '마켓형 물품 후원',
    desc: '현금이 아닌 물품을 직접 골라 후원해요.' },
  { Icon: Check, title: '실시간 달성률',
    desc: '요청 수량 대비 모인 수량을 실시간으로 확인할 수 있어요.' },
  { Icon: AlertTriangle, title: '긴급 후원 요청',
    desc: '기관이 급하게 필요한 물품을 직접 긴급으로 등록해 먼저 보여드려요.' },
  { Icon: Camera, title: '후원 인증',
    desc: '기관이 공개한 인증 사진으로 후원이 어떻게 쓰였는지 확인할 수 있어요.' },
  { Icon: Sparkles, title: '후원도우미 AI',
    desc: '예산이나 궁금한 점을 물어보면 지금 필요한 물품을 찾아드려요.' },
];

export default function AvailableNow() {
  return (
    <section id="available-now" className="bg-white py-20">
      <Container>
        <h2 className="text-center text-2xl text-ink">이미 이용할 수 있어요</h2>
        <p className="mt-3 text-center text-sm text-subtle">
          라이키에서 지금 바로 경험할 수 있는 기능들이에요
        </p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-hairline bg-cream p-6">
              <Icon size={24} className="text-brand" />
              <p className="mt-4 text-base text-ink">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
