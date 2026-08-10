import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { formatWon } from '../utils/urgency';

export default function RecommendCard({ pick, to }) {
  const { item, org, qty, percent, reason } = pick;

  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3 transition hover:border-brand"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
        <Package size={20} className="text-brand opacity-50" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-subtle">{org.name}</p>
        <p className="mt-0.5 truncate text-sm text-ink">
          {item.name} × {qty}
        </p>

        {reason && (
          <p className="mt-1 truncate text-xs text-accent-ink">{reason}</p>
        )}

        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-hairline">
            <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
          <span className="whitespace-nowrap text-xs text-subtle">{percent}%</span>
        </div>
      </div>

      <span className="whitespace-nowrap text-sm text-ink">
        {formatWon(item.price * qty)}원
      </span>
    </Link>
  );
}