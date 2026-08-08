import { Link } from 'react-router-dom';
import { Building2, BadgeCheck } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useDonation } from '../contexts/DonationContext';
import { progressOfAll } from '../utils/urgency';

export default function OrgCard({ organization }) {
  const { getRequestsByOrg } = useDonation();
  const open = getRequestsByOrg(organization.id).filter((r) => r.status === 'open');
  const percent = progressOfAll(open);
  const pendingQty = open.reduce((s, r) => s + r.pendingQty, 0);

  return (
    <Link
      to={`/org/${organization.id}`}
      className="block rounded-xl border border-hairline bg-white p-4 transition hover:border-brand"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
          <Building2 size={18} className="text-brand" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm text-ink">{organization.name}</p>
            {organization.verified && <BadgeCheck size={14} className="shrink-0 text-accent" />}
          </div>
          <p className="text-xs text-subtle">
            {organization.type} · {organization.distanceKm}km
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-subtle">{open.length}종의 물품이 필요합니다</p>

      <div className="mt-2">
        <ProgressBar percent={percent} complete={percent >= 100} />
      </div>
      {pendingQty > 0 && (
        <p className="mt-1 text-[11px] text-subtle">수락 대기 {pendingQty}개</p>
      )}
      <p className="mt-1.5 text-xs text-subtle">{percent}% 달성</p>
    </Link>
  );
}