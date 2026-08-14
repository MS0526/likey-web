export const requests = [
  { id: 'req-01', orgId: 'org-01', itemId: 'item-01', neededQty: 20, receivedQty: 12, date: '2025-01-29', status: 'open' },
  { id: 'req-02', orgId: 'org-01', itemId: 'item-08', neededQty: 10, receivedQty: 3,  date: '2025-01-28', status: 'open' },
  { id: 'req-03', orgId: 'org-01', itemId: 'item-06', neededQty: 15, receivedQty: 10, date: '2025-01-27', status: 'open' },
  { id: 'req-04', orgId: 'org-02', itemId: 'item-01', neededQty: 12, receivedQty: 8,  date: '2025-01-26', status: 'open' },
  { id: 'req-05', orgId: 'org-02', itemId: 'item-10', neededQty: 20, receivedQty: 14, date: '2025-01-25', status: 'open', urgentQty: 8, urgentReason: '재고 소진 · 즉시 필요' },
  { id: 'req-06', orgId: 'org-03', itemId: 'item-02', neededQty: 15, receivedQty: 7,  date: '2025-01-24', status: 'open' },
  { id: 'req-07', orgId: 'org-03', itemId: 'item-05', neededQty: 8,  receivedQty: 3,  date: '2025-01-23', status: 'open' },
  { id: 'req-08', orgId: 'org-04', itemId: 'item-03', neededQty: 10, receivedQty: 7,  date: '2025-01-22', status: 'open' },
  { id: 'req-09', orgId: 'org-04', itemId: 'item-04', neededQty: 15, receivedQty: 11, date: '2025-01-21', status: 'open', urgentQty: 5, urgentReason: '환절기 감기 급증' },
  { id: 'req-10', orgId: 'org-05', itemId: 'item-11', neededQty: 6,  receivedQty: 2,  date: '2025-01-20', status: 'open' },
  { id: 'req-11', orgId: 'org-05', itemId: 'item-01', neededQty: 18, receivedQty: 11, date: '2025-01-19', status: 'open' },
  { id: 'req-12', orgId: 'org-06', itemId: 'item-02', neededQty: 25, receivedQty: 10, date: '2025-01-18', status: 'open' },
  { id: 'req-13', orgId: 'org-06', itemId: 'item-06', neededQty: 20, receivedQty: 13, date: '2025-01-17', status: 'open', urgentQty: 8, urgentReason: '추위 대비 재고 부족' },
  { id: 'req-14', orgId: 'org-07', itemId: 'item-09', neededQty: 8,  receivedQty: 2,  date: '2025-01-16', status: 'open' },
  { id: 'req-15', orgId: 'org-07', itemId: 'item-12', neededQty: 30, receivedQty: 28, date: '2025-01-15', status: 'open' },
  { id: 'req-16', orgId: 'org-08', itemId: 'item-07', neededQty: 20, receivedQty: 6,  date: '2025-01-14', status: 'open' },
  { id: 'req-17', orgId: 'org-08', itemId: 'item-04', neededQty: 12, receivedQty: 12, date: '2025-01-13', status: 'closed' },
];

export const getRequestById = (id) => requests.find((r) => r.id === id);

export const getRequestsByOrg = (orgId) => requests.filter((r) => r.orgId === orgId);

/** 이 물품을 필요로 하는 기관 목록 — 물품 상세의 기관 선택에 사용 */
export const getRequestsByItem = (itemId) =>
  requests.filter((r) => r.itemId === itemId && r.status === 'open');