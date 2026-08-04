import { Link } from 'react-router-dom';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { getCategoryLabel } from '../data/items';
import { getRequestsByItem } from '../data/requests';
import { progressOfAll, urgencyOf, URGENCY_STYLE, formatWon } from '../utils/urgency';

export default function ItemCard({ item }) {
  const reqs = getRequestsByItem(item.id);
  const percent = progressOfAll(reqs);
  const urgency = urgencyOf(percent);

  return (
    <Link
      to={`/items/${item.id}`}
      className="block overflow-hidden rounded-xl border border-hairline bg-white transition hover:border-brand"
    >
      <div className="relative flex h-40 items-center justify-center bg-brand-soft">
        <ImageIcon size={30} className="text-brand opacity-40" />
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs ${URGENCY_STYLE[urgency.key]}`}>
          {urgency.label}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-subtle">{getCategoryLabel(item.category)}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink">{item.name}</p>
        <p className="mt-2 font-mono text-base text-brand">{formatWon(item.price)}원</p>

        <div className="mt-3">
          <ProgressBar percent={percent} complete={percent >= 100} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-subtle">
          <span>{percent}% 달성</span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {reqs.length}개 기관
          </span>
        </div>
      </div>
    </Link>
  );
}