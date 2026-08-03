export const requests = [
  { id: 'req-01', orgId: 'org-01', itemId: 'item-01', neededQty: 20, receivedQty: 14, deadline: '2026-08-10', status: 'open' },
  { id: 'req-02', orgId: 'org-01', itemId: 'item-02', neededQty: 20, receivedQty: 13, deadline: '2026-08-15', status: 'open' },
  { id: 'req-03', orgId: 'org-01', itemId: 'item-06', neededQty: 5,  receivedQty: 1,  deadline: '2026-08-22', status: 'open' },
  { id: 'req-04', orgId: 'org-02', itemId: 'item-03', neededQty: 20, receivedQty: 7,  deadline: '2026-08-12', status: 'open' },
  { id: 'req-05', orgId: 'org-02', itemId: 'item-05', neededQty: 15, receivedQty: 15, deadline: '2026-08-05', status: 'closed' },
  { id: 'req-06', orgId: 'org-02', itemId: 'item-07', neededQty: 30, receivedQty: 9,  deadline: '2026-08-18', status: 'open' },
  { id: 'req-07', orgId: 'org-03', itemId: 'item-04', neededQty: 20, receivedQty: 3,  deadline: '2026-08-14', status: 'open' },
  { id: 'req-08', orgId: 'org-03', itemId: 'item-08', neededQty: 10, receivedQty: 6,  deadline: '2026-08-20', status: 'open' },
  { id: 'req-09', orgId: 'org-04', itemId: 'item-01', neededQty: 12, receivedQty: 2,  deadline: '2026-08-11', status: 'open' },
  { id: 'req-10', orgId: 'org-04', itemId: 'item-02', neededQty: 25, receivedQty: 20, deadline: '2026-08-16', status: 'open' },
];

export const getRequestById = (id) => requests.find((r) => r.id === id);

export const getRequestsByOrg = (orgId) =>
  requests.filter((r) => r.orgId === orgId);

export const getRequestsByItem = (itemId) =>
  requests.filter((r) => r.itemId === itemId && r.status === 'open');