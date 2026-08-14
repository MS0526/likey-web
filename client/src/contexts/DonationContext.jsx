import { createContext, useContext, useMemo, useState } from 'react';
import { donations as seedDonations } from '../data/donations';
import { requests as seedRequests } from '../data/requests';
import { getItemById } from '../data/items';

const DonationContext = createContext(null);

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState(seedDonations);
  const [requests, setRequests] = useState(seedRequests);

  // 요청(orgId+itemId)별로 아직 기관이 수락하지 않은 pending 후원 수량 합계.
  // receivedQty(달성률)는 건드리지 않고, 화면에 "수락 대기 N개"로 별도 노출하는 데만 쓴다.
  const pendingByKey = useMemo(() => {
    const map = new Map();
    donations.forEach((d) => {
      if (d.status !== 'pending') return;
      const key = `${d.orgId}::${d.itemId}`;
      map.set(key, (map.get(key) ?? 0) + d.qty);
    });
    return map;
  }, [donations]);

  const getPendingQty = (orgId, itemId) => pendingByKey.get(`${orgId}::${itemId}`) ?? 0;

  const withPendingQty = (r) => ({ ...r, pendingQty: getPendingQty(r.orgId, r.itemId) });

  /** 개인이 결제 → 수락 대기 상태로 후원 생성 */
  const createDonation = ({ itemId, orgId, qty, donor = '나' }) => {
    const donation = {
      id: `don-${Date.now()}`,
      itemId,
      orgId,
      qty,
      donor,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    };
    setDonations((prev) => [donation, ...prev]);
    return donation;
  };

  /** 기관이 수락 → 배송중으로 바꾸고 해당 요청의 받은 수량을 올린다 */
  const approve = (donationId) => {
    const target = donations.find((d) => d.id === donationId);
    if (!target || target.status !== 'pending') return;

    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, status: 'shipping' } : d))
    );

    setRequests((prev) =>
      prev.map((r) =>
        r.orgId === target.orgId && r.itemId === target.itemId
          ? { ...r, receivedQty: Math.min(r.neededQty, r.receivedQty + target.qty) }
          : r
      )
    );
  };

  /** 기관이 거절 → 수량은 건드리지 않는다 */
  const reject = (donationId) =>
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, status: 'rejected' } : d))
    );

  /** 기관이 새 물품 요청을 등록 → 즉시 마켓에 노출되는 open 요청 생성 */
  const addRequest = ({ orgId, itemId, neededQty, isUrgent = false, urgentReason = null }) => {
    const request = {
      id: `req-${Date.now()}`,
      orgId,
      itemId,
      neededQty,
      receivedQty: 0,
      date: new Date().toISOString().slice(0, 10),
      status: 'open',
      isUrgent,
      urgentReason: isUrgent ? urgentReason : null,
    };
    setRequests((prev) => [request, ...prev]);
    return request;
  };

  const value = useMemo(
    () => ({
      donations,
      requests: requests.map(withPendingQty),
      createDonation,
      approve,
      reject,
      addRequest,
      getPendingQty,
      getRequestsByItem: (itemId) =>
        requests.filter((r) => r.itemId === itemId && r.status === 'open').map(withPendingQty),
      getRequestsByOrg: (orgId) =>
        requests.filter((r) => r.orgId === orgId).map(withPendingQty),
      getDonationsByOrg: (orgId) => donations.filter((d) => d.orgId === orgId),
      totalAmount: (list) =>
        list.reduce((s, d) => s + getItemById(d.itemId).price * d.qty, 0),
    }),
    [donations, requests]
  );

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

export function useDonation() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error('useDonation은 DonationProvider 안에서만 쓸 수 있습니다');
  return ctx;
}