import { Link } from 'react-router-dom';
import { Building2, BadgeCheck } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';
import { getRegionLabel } from '../data/organizations';

export default function OrgCard({ organization }) {
  const { getRequestsByOrg } = useDonation();
  const open = getRequestsByOrg(organization.id).filter((r) => r.status === 'open');
  const isUrgent = open.some((r) => r.urgentQty > 0);

  return (
    <Link
      to={`/orgs/${organization.id}`}
      className="block rounded-xl border border-hairline bg-white p-4 transition hover:border-brand"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
          <Building2 size={18} className="text-brand" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm text-ink">{organization.name}</p>
            {organization.verified && <BadgeCheck size={14} className="shrink-0 text-accent" />}
          </div>
          <p className="text-xs text-subtle">{getRegionLabel(organization.region)}</p>
        </div>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-alert px-2 py-0.5 text-[11px] text-white">
            긴급
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-subtle">{open.length}종의 물품이 필요합니다</p>
    </Link>
  );
}