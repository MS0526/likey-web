import { Check, X } from 'lucide-react';
import { getItemById } from '../data/items';
import { formatWon } from '../utils/urgency';

export default function ApprovalRow({ donation, onApprove, onReject }) {
  const item = getItemById(donation.itemId);
  const total = item.price * donation.qty;

  return (
    <div className="flex items-center justify-between rounded-xl border border-hairline bg-white px-5 py-4">
      <div>
        <p className="text-sm text-ink">{item.name} × {donation.qty}</p>
        <p className="mt-1 text-xs text-subtle">
          후원자: {donation.donor} · {donation.date} ·{' '}
          <span className="font-mono">{formatWon(total)}원</span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onReject(donation.id)}
          className="flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-sm text-subtle hover:border-alert hover:text-alert"
        >
          <X size={13} /> 거절
        </button>
        <button
          onClick={() => onApprove(donation.id)}
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm text-white"
        >
          <Check size={13} /> 수락
        </button>
      </div>
    </div>
  );
}