import { organizations } from '../data/organizations';
import { useDonation } from '../contexts/DonationContext';
import Container from './Container';

export default function StatBar() {
  const { requests } = useDonation();

  const needCount = requests
    .filter((r) => r.status === 'open')
    .reduce((s, r) => s + Math.max(0, r.neededQty - r.receivedQty), 0);

  const children = organizations.reduce((s, o) => s + o.children, 0);

  const stats = [
    { value: organizations.length, unit: '개', label: '등록 기관' },
    { value: needCount, unit: '개', label: '필요 물품' },
    { value: children, unit: '명', label: '혜택 받은 아동' },
    { value: '48.2', unit: 'M원', label: '누적 후원액' },
  ];

  return (
    <section className="bg-cream pb-20">
      <Container>
        <div className="mx-auto grid max-w-3xl gap-3 md:grid-cols-4">
          {stats.map(({ value, unit, label }) => (
            <div key={label} className="rounded-xl bg-white px-4 py-6 text-center">
              <p className="font-mono text-2xl text-brand">
                {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                <span className="text-sm">{unit}</span>
              </p>
              <p className="mt-2 text-xs text-subtle">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}