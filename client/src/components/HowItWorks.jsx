import { ShoppingBag, Shield, Truck } from 'lucide-react';
import Container from './Container';

const STEPS = [
  { n: '01', Icon: ShoppingBag, title: '물품 선택',
    desc: '마켓에서 기관이 필요로 하는 물품을 골라 결제합니다.', accent: false },
  { n: '02', Icon: Shield, title: '기관 수락',
    desc: '등록된 기관이 수락해야 배송이 시작됩니다. 악용을 원천 차단합니다.', accent: true },
  { n: '03', Icon: Truck, title: '직접 배송',
    desc: '결제한 물품이 기관으로 직접 배송되어 아이들에게 전달됩니다.', accent: false },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-20">
      <Container>
        <h2 className="text-center text-2xl text-ink">어떻게 작동하나요?</h2>
        <p className="mt-3 text-center text-sm text-subtle">
          기부 단체를 거치지 않고 필요한 기관에 바로 전달됩니다
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
          {STEPS.map(({ n, Icon, title, desc, accent }) => (
            <div
              key={n}
              className={`rounded-2xl bg-white p-7 ${
                accent ? 'border-2 border-accent' : 'border border-hairline'
              }`}
            >
              <Icon size={26} className={accent ? 'text-accent-ink' : 'text-brand'} />
              <p className="mt-5 font-mono text-xs text-subtle">{n}</p>
              <p className="mt-1.5 text-lg text-ink">{title}</p>
              <p className="mt-3 text-sm leading-relaxed text-subtle">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}