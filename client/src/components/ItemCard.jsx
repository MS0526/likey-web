import { Link } from 'react-router-dom';
import { MapPin, Image as ImageIcon, Camera } from 'lucide-react';
import ProgressBar from './ProgressBar';
import ItemImage from './ItemImage';
import { getCategoryLabel } from '../data/items';
import { useDonation } from '../contexts/DonationContext';
import { progressOfAll, urgencyOf, URGENCY_STYLE, formatWon } from '../utils/urgency';

export default function ItemCard({ item }) {
  const { getRequestsByItem, getPublishedProofs } = useDonation();
  const reqs = getRequestsByItem(item.id);
  const percent = progressOfAll(reqs);
  const urgency = reqs.some((r) => r.urgentQty > 0) ? { key: 'high', label: '긴급' } : urgencyOf(percent);
  const pendingQty = reqs.reduce((s, r) => s + r.pendingQty, 0);
  const proofCount = getPublishedProofs().filter((p) => p.itemId === item.id).length;

  return (
    <Link
      to={`/items/${item.id}`}
      className="block overflow-hidden rounded-xl border border-hairline bg-white transition hover:border-brand"
    >
      <ItemImage
        src={item.image}
        alt={item.name}
        aspect="aspect-square"
        placeholderIcon={<ImageIcon size={30} className="text-brand opacity-40" />}
      >
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs ${URGENCY_STYLE[urgency.key]}`}>
          {urgency.label}
        </span>
      </ItemImage>

      <div className="p-4">
        <p className="text-xs text-subtle">{getCategoryLabel(item.category)}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink">{item.name}</p>
        <p className="mt-2 font-mono text-base text-brand">{formatWon(item.price)}원</p>

        <div className="mt-3">
          <ProgressBar percent={percent} complete={percent >= 100} />
        </div>
        {pendingQty > 0 && (
          <p className="mt-1 text-[11px] text-subtle">수락 대기 {pendingQty}개</p>
        )}
        <div className="mt-2 flex items-center justify-between text-xs text-subtle">
          <span>{percent}% 달성</span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {reqs.length}개 기관
          </span>
        </div>
        {proofCount > 0 && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-brand">
            <Camera size={11} /> 후원 인증 {proofCount}건
          </p>
        )}
      </div>
    </Link>
  );
}