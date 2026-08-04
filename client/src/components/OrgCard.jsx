import { Building2, BadgeCheck } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { getRequestsByOrg } from '../data/requests';

export default function OrgCard({ organization }) {
  const openRequests = getRequestsByOrg(organization.id).filter(
    (r) => r.status === 'open'
  );

  const totalNeeded = openRequests.reduce((sum, r) => sum + r.neededQty, 0);
  const totalReceived = openRequests.reduce((sum, r) => sum + r.receivedQty, 0);

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
          <Building2 size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-sm text-gray-900">{organization.name}</p>
            {organization.verified && (
              <BadgeCheck size={14} className="shrink-0 text-orange-500" />
            )}
          </div>
          <p className="text-xs text-gray-500">
            {organization.type} · {organization.distanceKm}km
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-600">
        {openRequests.length}종의 물품이 필요합니다
      </p>

      <div className="mt-2">
        <ProgressBar receivedQty={totalReceived} neededQty={totalNeeded} />
      </div>
    </div>
  );
}