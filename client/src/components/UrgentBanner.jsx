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

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {items.map(({ item, percent }) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="flex items-center gap-3 rounded-lg bg-white p-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
              <ImageIcon size={16} className="text-brand opacity-40" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{item.name}</p>
              <p className="mt-0.5 text-xs text-alert">{percent}% 달성</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}