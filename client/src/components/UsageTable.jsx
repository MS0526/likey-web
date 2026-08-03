import { getItemById } from '../data/items';
import { DONATION_STATUS } from '../data/donations';

export default function UsageTable({ donations }) {
  if (donations.length === 0) {
    return (
      <p className="rounded-xl border border-hairline bg-white py-16 text-center text-sm text-subtle">
        아직 수령한 물품이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-white">
      <div className="grid grid-cols-4 bg-hairline px-5 py-3 text-xs text-subtle">
        <span>날짜</span><span>물품</span><span>후원자</span><span>상태</span>
      </div>

      {donations.map((d) => {
        const status = DONATION_STATUS[d.status];
        return (
          <div key={d.id} className="grid grid-cols-4 items-center border-t border-hairline px-5 py-3.5">
            <span className="font-mono text-xs text-subtle">{d.date}</span>
            <span className="text-sm text-ink">{getItemById(d.itemId).name} × {d.qty}</span>
            <span className="text-sm text-subtle">{d.donor}</span>
            <span>
              <span className={`rounded-full px-2.5 py-1 text-xs ${status.style}`}>
                {status.label}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}