/** status: pending(수락 대기) | shipping(배송중) | received(수령완료) | rejected(거절) */
export const donations = [
  { id: 'don-01', itemId: 'item-01', orgId: 'org-01', qty: 2,  donor: '박지혜',       date: '2025-01-30', status: 'pending',  anonymous: false },
  { id: 'don-02', itemId: 'item-06', orgId: 'org-01', qty: 5,  donor: '㈜그린코리아', date: '2025-01-30', status: 'pending',  anonymous: false },
  { id: 'don-03', itemId: 'item-11', orgId: 'org-01', qty: 1,  donor: '최민수',       date: '2025-01-29', status: 'pending',  anonymous: true },
  { id: 'don-04', itemId: 'item-01', orgId: 'org-01', qty: 3,  donor: '㈜나눔코리아', date: '2025-01-28', status: 'received', anonymous: false },
  { id: 'don-05', itemId: 'item-06', orgId: 'org-01', qty: 12, donor: '김지수 외 4명', date: '2025-01-25', status: 'shipping', anonymous: false },
  { id: 'don-06', itemId: 'item-10', orgId: 'org-01', qty: 8,  donor: '박민준',       date: '2025-01-20', status: 'received', anonymous: true },
];

export const DONATION_STATUS = {
  pending:  { label: '수락 대기', style: 'bg-accent-soft text-accent-ink' },
  shipping: { label: '배송중',   style: 'bg-brand-soft text-brand' },
  received: { label: '수령완료', style: 'bg-brand-soft text-brand' },
  rejected: { label: '거절됨',   style: 'bg-alert-soft text-alert' },
};

export const getDonationsByOrg = (orgId) => donations.filter((d) => d.orgId === orgId);