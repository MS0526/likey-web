import ProgressBar from './ProgressBar';
import { getItemById, getCategoryLabel } from '../data/items';
import { progressOf, urgencyOf, URGENCY_STYLE } from '../utils/urgency';

export default function RequestRow({ request }) {
  const item = getItemById(request.itemId);
  const percent = progressOf(request);
  const urgency = urgencyOf(percent);
  const remain = Math.max(0, request.neededQty - request.receivedQty - (request.pendingQty ?? 0));

  return (
    <div className="rounded-xl border border-hairline bg-white px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-ink">{item.name}</p>
            {request.isUrgent && (
              <span className="rounded-full bg-alert px-2 py-0.5 text-[11px] text-white">긴급</span>
            )}
          </div>
          {request.isUrgent && request.urgentReason && (
            <p className="mt-1 text-xs text-alert">{request.urgentReason}</p>
          )}
          <p className="mt-1 text-xs text-subtle">
            {getCategoryLabel(item.category)} · {request.neededQty}개 요청 · {request.date}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs ${URGENCY_STYLE[urgency.key]}`}>
          {percent}% 달성
        </span>
      </div>

      <div className="mt-3"><ProgressBar percent={percent} complete={percent >= 100} /></div>
      {request.pendingQty > 0 && (
        <p className="mt-1 text-[11px] text-subtle">수락 대기 {request.pendingQty}개</p>
      )}
      <p className="mt-2 text-xs text-subtle">
        받은 수량 {request.receivedQty}개 · 남은 요청 {remain}개
      </p>
    </div>
  );
}