import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Package } from 'lucide-react';
import { items } from '../data/items';
import { getOrganizationById } from '../data/organizations';
import { useDonation } from '../contexts/DonationContext';
import { progressOf, formatWon } from '../utils/urgency';

const BUDGETS = [20000, 30000, 50000];

export default function AiDemo() {
  const { requests } = useDonation();
  const [budget, setBudget] = useState(30000);

  // TODO: 백엔드 연결 시 POST /api/ai/recommend 응답으로 교체
  // 응답 형식이 { recommendations: [{ requestId, qty, reason }] } 이면
  // 이 함수 내부만 바꾸고 UI는 그대로 사용 가능
  const getRecommendation = (won) => {
    const minPrice = Math.min(...items.map((i) => i.price));

    const candidates = requests
      .filter((r) => r.status === 'open')
      .map((r) => {
        const item = items.find((i) => i.id === r.itemId);
        const remain = r.neededQty - r.receivedQty - (r.pendingQty ?? 0);
        return { req: r, item, percent: progressOf(r), remain };
      })
      .filter((c) => c.item && c.remain > 0)
      .sort((a, b) => a.percent - b.percent);   // 달성률 낮은 순 = 급한 순

    const picks = [];
    let rest = won;

    for (const c of candidates) {
      if (picks.length >= 3) break;
      if (rest < minPrice) break;
      if (rest < c.item.price) continue;

      const qty = Math.min(Math.floor(rest / c.item.price), c.remain);
      if (qty <= 0) continue;

      const existing = picks.find((p) => p.item.id === c.item.id && p.req.orgId === c.req.orgId);
      if (existing) {
        existing.qty += qty;
      } else {
        picks.push({ req: c.req, item: c.item, org: getOrganizationById(c.req.orgId), qty, percent: c.percent });
      }
      rest -= qty * c.item.price;
    }

    if (picks.length === 0) return null;

    const orgCount = new Set(picks.map((p) => p.req.orgId)).size;
    return {
      message: `${won / 10000}만원이면 ${orgCount}개 기관에 물품을 보낼 수 있어요`,
      picks,
      total: won - rest,
      rest,
    };
  };

  const result = getRecommendation(budget);

  return (
    <section className="bg-white px-6 py-20">
      <p className="text-center text-xs text-accent-ink">후원 초보자를 위한</p>
      <h2 className="mt-2 text-center text-2xl leading-snug text-ink">
        얼마를 후원해야 할지<br />모르겠나요?
      </h2>
      <p className="mt-4 text-center text-sm text-subtle">
        금액만 알려주시면 AI가 지금 가장 필요한 물품을 찾아드려요
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {BUDGETS.map((b) => (
          <button
            key={b}
            onClick={() => setBudget(b)}
            className={`rounded-full px-6 py-2.5 text-sm transition ${
              budget === b
                ? 'bg-accent text-ink'
                : 'border border-hairline bg-white text-subtle hover:border-accent'
            }`}
          >
            {b / 10000}만원
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-hairline bg-cream p-6">
        {result ? (
          <>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                <Sparkles size={15} className="text-accent-ink" />
              </span>
              <p className="text-sm leading-relaxed text-ink">{result.message}</p>
            </div>

            <div className="mt-4 space-y-3">
              {result.picks.map((p) => (
                <Link
                  key={p.req.id}
                  to={`/auth?next=/items/${p.item.id}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 transition hover:ring-1 hover:ring-brand"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
                    <Package size={22} className="text-brand opacity-50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-subtle">{p.org.name}</p>
                    <p className="mt-0.5 text-sm text-ink">
                      {p.item.name} × {p.qty}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-hairline">
                        <div className="h-full bg-accent" style={{ width: `${p.percent}%` }} />
                      </div>
                      <span className="whitespace-nowrap text-xs text-subtle">
                        {p.percent}% 달성
                      </span>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-sm text-ink">
                    {formatWon(p.item.price * p.qty)}원
                  </span>
                </Link>
              ))}
            </div>

            {result.rest > 0 && (
              <p className="mt-3 text-center text-xs text-subtle">
                남은 {formatWon(result.rest)}원으로는 다른 물품을 함께 담을 수 있어요
              </p>
            )}
          </>
        ) : (
          <p className="py-8 text-center text-sm text-subtle">
            해당 금액으로 후원 가능한 물품이 없습니다. 금액을 올려보세요.
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          to={result ? `/auth?next=/items/${result.picks[0].item.id}` : '/auth'}
          className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm text-ink"
        >
          이대로 후원 시작하기
        </Link>
        <p className="mt-3 text-xs text-subtle">회원가입 후 기관이 수락하면 배송이 시작됩니다</p>
      </div>
    </section>
  );
}