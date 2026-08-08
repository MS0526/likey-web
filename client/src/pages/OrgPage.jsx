import { useState } from 'react';
import { Package, CheckCircle2, BarChart3, Plus, X } from 'lucide-react';
import OrgHeader from '../components/OrgHeader';
import MetricCard from '../components/MetricCard';
import TabNav from '../components/TabNav';
import RequestRow from '../components/RequestRow';
import ApprovalRow from '../components/ApprovalRow';
import UsageTable from '../components/UsageTable';
import { organizations } from '../data/organizations';
import { items } from '../data/items';
import { useDonation } from '../contexts/DonationContext';

export default function OrgPage() {
  const org = organizations[0];
  const [tab, setTab] = useState('request');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newItemId, setNewItemId] = useState(items[0]?.id ?? '');
  const [newNeededQty, setNewNeededQty] = useState(10);

  const { getDonationsByOrg, getRequestsByOrg, approve, reject, totalAmount, addRequest } =
    useDonation();

  const mine = getDonationsByOrg(org.id);
  const pending = mine.filter((d) => d.status === 'pending');
  const settled = mine.filter((d) => d.status === 'shipping' || d.status === 'received');
  const amount = totalAmount(settled);

  const openRequestModal = () => {
    setNewItemId(items[0]?.id ?? '');
    setNewNeededQty(10);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const neededQty = Number(newNeededQty);
    if (!newItemId || !Number.isFinite(neededQty) || neededQty <= 0) return;
    addRequest({ orgId: org.id, itemId: newItemId, neededQty });
    setShowRequestModal(false);
  };

  const tabs = [
    { key: 'request', label: '물품 요청', Icon: Package },
    { key: 'approve', label: '물품 수락', Icon: CheckCircle2, badge: pending.length },
    { key: 'usage', label: '사용 현황', Icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <OrgHeader organization={org} />

      <div className="px-8 py-8">
        <h1 className="text-2xl text-ink">기관 대시보드</h1>
        <p className="mt-1.5 text-sm text-subtle">{org.name} · 아동 {org.children}명</p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <MetricCard value={settled.length} unit="건" label="이번달 후원 수령" />
          <MetricCard value={pending.length} unit="건" label="대기 중 후원" accent />
          <MetricCard value={new Set(settled.map((d) => d.itemId)).size} unit="종" label="수령한 물품 종류" />
          <MetricCard value={`₩${Math.round(amount / 1000)}`} unit="K" label="이번달 후원액" />
        </div>

        <div className="mt-6">
          <TabNav tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {tab === 'request' && (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-ink">필요한 물품 요청</h2>
              <button
                onClick={openRequestModal}
                className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm text-white"
              >
                <Plus size={14} /> 물품 추가 요청
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {getRequestsByOrg(org.id).map((r) => (
                <RequestRow key={r.id} request={r} />
              ))}
            </div>
          </section>
        )}

        {tab === 'approve' && (
          <section className="mt-6">
            <h2 className="text-lg text-ink">후원 수락 관리</h2>
            <p className="mt-1.5 text-sm text-subtle">
              후원자가 결제한 물품을 확인하고 수락 여부를 결정합니다.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {pending.map((d) => (
                <ApprovalRow key={d.id} donation={d} onApprove={approve} onReject={reject} />
              ))}
              {pending.length === 0 && (
                <div className="rounded-xl border border-hairline bg-white py-16 text-center">
                  <CheckCircle2 size={28} className="mx-auto text-brand" />
                  <p className="mt-3 text-sm text-ink">대기 중인 후원이 없습니다</p>
                  <p className="mt-1.5 text-xs text-subtle">
                    마켓에서 후원이 들어오면 이곳에 표시됩니다
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'usage' && (
          <section className="mt-6">
            <h2 className="text-lg text-ink">물품 사용 현황</h2>
            <div className="mt-4">
              <UsageTable donations={mine.filter((d) => d.status !== 'pending')} />
            </div>
          </section>
        )}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-ink">물품 추가 요청</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-subtle hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-xs text-subtle">물품 선택</label>
                <select
                  value={newItemId}
                  onChange={(e) => setNewItemId(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-subtle">필요 수량</label>
                <input
                  type="number"
                  min={1}
                  value={newNeededQty}
                  onChange={(e) => setNewNeededQty(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink"
                />
              </div>

              <div className="mt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 rounded-lg border border-hairline py-2.5 text-sm text-subtle"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-brand py-2.5 text-sm text-white"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}