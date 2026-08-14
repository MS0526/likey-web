import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';

export default function UrgentBanner({ items }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl bg-alert-soft p-5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-alert" />
        <p className="text-sm text-alert">긴급 후원 필요</p>
      </div>

      <div className="relative mt-4">
        <div className="scrollbar-hide flex gap-3 overflow-x-auto">
          {items.map(({ item, percent, urgentReason, neededQty, urgentQty }) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className="flex min-w-[200px] shrink-0 items-center gap-3 rounded-lg bg-white p-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
                <ImageIcon size={16} className="text-brand opacity-40" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{item.name}</p>
                <p className="mt-0.5 truncate text-xs text-alert">
                  {urgentReason || `${percent}% 달성`}
                </p>
                {urgentQty > 0 && (
                  <p className="mt-0.5 truncate text-[11px] text-subtle">
                    {neededQty}개 요청 (긴급 {urgentQty}개)
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {items.length >= 5 && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-alert-soft to-transparent" />
        )}
      </div>
    </div>
  );
}