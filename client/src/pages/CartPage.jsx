import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useDonation } from '../contexts/DonationContext';
import { getItemById } from '../data/items';
import { getOrganizationById } from '../data/organizations';
import { formatWon } from '../utils/urgency';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, setQty, clearCart } = useCart();
  const { createDonation } = useDonation();
  const [done, setDone] = useState(false);

  const rows = cartItems.map((c) => ({
    ...c,
    item: getItemById(c.itemId),
    org: getOrganizationById(c.orgId),
  }));

  const total = rows.reduce((s, r) => s + r.item.price * r.qty, 0);

  const handleCheckout = () => {
    if (rows.length === 0) return;
    rows.forEach((r) =>
      createDonation({ itemId: r.itemId, orgId: r.orgId, qty: r.qty, donor: '나 (테스트 후원자)' })
    );
    clearCart();
    setDone(true);
    setTimeout(() => navigate('/market'), 1600);
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center gap-4 bg-white px-6 py-3">
        <Link to="/market" className="text-subtle"><ArrowLeft size={18} /></Link>
        <span className="text-sm text-ink">장바구니</span>
      </header>

      {done && (
        <div className="flex items-center justify-center gap-2 bg-brand px-4 py-3 text-sm text-white">
          <Check size={15} />
          결제 완료. 기관의 수락을 기다립니다.
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-8">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-hairline bg-white py-20 text-center">
            <ShoppingCart size={28} className="mx-auto text-subtle" />
            <p className="mt-3 text-sm text-ink">장바구니가 비어 있습니다</p>
            <Link to="/market" className="mt-4 inline-block text-sm text-brand">
              마켓 둘러보기
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-xl border border-hairline bg-white p-4"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{r.item.name}</p>
                    <p className="mt-1 text-xs text-subtle">{r.org.name}</p>
                    <p className="mt-1 font-mono text-sm text-brand">
                      {formatWon(r.item.price * r.qty)}원
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(r.id, r.qty - 1)}
                      className="h-8 w-8 rounded-lg border border-hairline text-ink"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-mono text-sm text-ink">{r.qty}</span>
                    <button
                      onClick={() => setQty(r.id, r.qty + 1)}
                      className="h-8 w-8 rounded-lg border border-hairline text-ink"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(r.id)}
                    className="text-subtle hover:text-alert"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-hairline bg-white p-4">
              <span className="text-sm text-subtle">총 결제 금액</span>
              <span className="font-mono text-lg text-brand">{formatWon(total)}원</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={done}
              className="mt-4 w-full rounded-lg bg-brand py-3.5 text-sm text-white disabled:opacity-40"
            >
              {formatWon(total)}원 결제하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
