import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, BadgeCheck } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { getItemById } from '../data/items';
import { getOrganizationById, getRegionLabel } from '../data/organizations';
import { useDonation } from '../contexts/DonationContext';
import { progressOf } from '../utils/urgency';

export default function OrgDetailPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { getRequestsByOrg } = useDonation();

  const org = getOrganizationById(orgId);

  if (!org) {
    return <p className="p-8 text-sm text-subtle">존재하지 않는 기관입니다.</p>;
  }

  // 이 기관이 요청 중인(open) 물품 — 긴급 요청을 먼저 보여준다
  const rows = getRequestsByOrg(orgId)
    .filter((r) => r.status === 'open')
    .map((r) => ({ ...r, item: getItemById(r.itemId), percent: progressOf(r) }))
    .sort((a, b) => (b.urgentQty > 0 ? 1 : 0) - (a.urgentQty > 0 ? 1 : 0));

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center gap-4 bg-white px-6 py-3">
        <Link to="/market" className="text-subtle"><ArrowLeft size={18} /></Link>
        <span className="text-sm text-ink">기관 상세</span>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl text-ink">{org.name}</h1>
          {org.verified && <BadgeCheck size={18} className="text-accent" />}
        </div>
        <p className="mt-1.5 text-sm text-subtle">{getRegionLabel(org.region)}</p>
        <p className="mt-3 text-sm leading-relaxed text-subtle">{org.story}</p>

        <h2 className="mt-8 text-sm text-ink">이 기관이 요청 중인 물품</h2>
        <div className="mt-3 flex flex-col gap-3">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/items/${r.itemId}?org=${orgId}`)}
              className="flex items-center gap-4 rounded-xl border border-hairline bg-white p-4 text-left transition hover:border-brand"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-soft">
                {r.item.image ? (
                  <img src={r.item.image} alt={r.item.name} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-brand opacity-40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm text-ink">{r.item.name}</p>
                  {r.urgentQty > 0 && (
                    <span className="shrink-0 rounded-full bg-alert px-2 py-0.5 text-[11px] text-white">긴급</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-subtle">
                  총 필요 {r.neededQty}개{r.urgentQty > 0 && ` (긴급 ${r.urgentQty}개)`} · 현재 {r.receivedQty}개
                </p>
                <div className="mt-2">
                  <ProgressBar percent={r.percent} complete={r.percent >= 100} />
                </div>
                <p className="mt-1 text-xs text-subtle">{r.percent}% 달성</p>
              </div>
            </button>
          ))}

          {rows.length === 0 && (
            <p className="rounded-lg border border-hairline bg-white p-4 text-sm text-subtle">
              현재 이 기관이 요청 중인 물품이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
