import { Router, Request, Response } from 'express';

const router = Router();

// ==========================================
// 1. DATA MODELS & DUMMY DATA
// ==========================================

export const CATEGORIES = [
  { key: 'food', label: '식량' },
  { key: 'goods', label: '공산품' },
  { key: 'toy', label: '장난감' },
  { key: 'clothing', label: '의류' },
  { key: 'medicine', label: '의약품' },
  { key: 'edu', label: '교육용품' },
];

export const items = [
  { id: 'item-01', name: '어린이 쌀 10kg', category: 'food', price: 28000, weight: '10kg', description: '아이들 주식용 백미입니다. 도정일 기준 2주 이내 제품으로 배송됩니다.' },
  { id: 'item-02', name: '라면 혼합 세트 (40봉)', category: 'food', price: 32000, weight: '5.2kg', description: '순한맛 위주로 구성된 어린이용 라면 세트입니다.' },
  { id: 'item-03', name: '어린이 샴푸·비누 세트', category: 'goods', price: 15000, weight: '1.4kg', description: '무향·저자극 성분의 아동용 세면 용품 묶음입니다.' },
  { id: 'item-04', name: '유아 기저귀 (대용량)', category: 'goods', price: 38000, weight: '3.8kg', description: '중형 사이즈 120매 대용량 팩입니다.' },
  { id: 'item-05', name: '레고 클래식 창작 세트', category: 'toy', price: 45000, weight: '900g', description: '3세 이상 사용 가능한 대형 블록 120피스 구성입니다.' },
  { id: 'item-06', name: '어린이 내복 세트 (겨울용)', category: 'clothing', price: 22000, weight: '400g', description: '기모 안감 상하의 세트. 100~140 사이즈 선택 가능합니다.' },
  { id: 'item-07', name: '아동 운동화', category: 'clothing', price: 34000, weight: '600g', description: '가벼운 메쉬 소재의 아동용 운동화입니다. 180~230mm.' },
  { id: 'item-08', name: '어린이 종합 비타민', category: 'medicine', price: 18000, weight: '250g', description: '만 3세 이상 복용 가능한 츄어블 형태 종합 비타민입니다.' },
  { id: 'item-09', name: '가정용 상비약 키트', category: 'medicine', price: 26000, weight: '700g', description: '해열 패치, 소독약, 밴드 등으로 구성된 기본 구급 키트입니다.' },
  { id: 'item-10', name: '색연필·스케치북 세트', category: 'edu', price: 12000, weight: '800g', description: '36색 색연필과 스케치북 3권으로 구성된 미술 용품입니다.' },
  { id: 'item-11', name: '아동 도서 패키지', category: 'edu', price: 55000, weight: '2.6kg', description: '유아~초등 저학년용 창작 동화책 12권 묶음입니다.' },
  { id: 'item-12', name: '초등 학습 노트 10권 세트', category: 'edu', price: 8500, weight: '1.2kg', description: '초등학생용 줄노트 10권 묶음입니다.' },
];

export const donations = [
  { id: 'don-01', itemId: 'item-01', orgId: 'org-01', qty: 2, donor: '박지혜', date: '2025-01-30', status: 'pending' },
  { id: 'don-02', itemId: 'item-06', orgId: 'org-01', qty: 5, donor: '㈜그린코리아', date: '2025-01-30', status: 'pending' },
  { id: 'don-03', itemId: 'item-11', orgId: 'org-01', qty: 1, donor: '최민수', date: '2025-01-29', status: 'pending' },
  { id: 'don-04', itemId: 'item-01', orgId: 'org-01', qty: 3, donor: '㈜나눔코리아', date: '2025-01-28', status: 'received' },
  { id: 'don-05', itemId: 'item-06', orgId: 'org-01', qty: 12, donor: '김지수 외 4명', date: '2025-01-25', status: 'shipping' },
  { id: 'don-06', itemId: 'item-10', orgId: 'org-01', qty: 8, donor: '박민준', date: '2025-01-20', status: 'received' },
];

export const organizations = [
  { id: 'org-01', name: '서울 햇살 보육원', type: '보육원', children: 32, region: 'gyeonggi', x: 159, y: 151, distanceKm: 3.4, verified: true, story: '0세부터 18세까지 32명의 아이들이 함께 생활하고 있습니다.' },
  { id: 'org-02', name: '수원 늘봄아동센터', type: '지역아동센터', children: 24, region: 'gyeonggi', x: 163, y: 175, distanceKm: 7.8, verified: true, story: '방과 후 돌봄이 필요한 아동 24명을 지원하고 있습니다.' },
  { id: 'org-03', name: '용인 참사랑의집', type: '아동양육시설', children: 18, region: 'gyeonggi', x: 172, y: 177, distanceKm: 12.1, verified: true, story: '가정 밖 청소년들의 자립을 돕는 시설입니다.' },
  { id: 'org-04', name: '대전 씨앗의집', type: '보육원', children: 21, region: 'chungnam', x: 186, y: 248, distanceKm: 141.2, verified: true, story: '미취학 아동 위주로 21명이 생활하고 있습니다.' },
  { id: 'org-05', name: '전주 밝은아이들', type: '지역아동센터', children: 29, region: 'jeonbuk', x: 170, y: 290, distanceKm: 196.4, verified: true, story: '저소득 가정 아동의 학습과 급식을 지원합니다.' },
  { id: 'org-06', name: '광주 다솜의집', type: '보육원', children: 27, region: 'jeonnam', x: 151, y: 342, distanceKm: 241.0, verified: true, story: '형제자매가 함께 지낼 수 있는 가정형 보육 시설입니다.' },
  { id: 'org-07', name: '대구 새싹의집', type: '아동양육시설', children: 23, region: 'gyeongbuk', x: 263, y: 286, distanceKm: 237.8, verified: true, story: '장애 아동을 포함해 23명이 생활하는 시설입니다.' },
  { id: 'org-08', name: '부산 온빛아동센터', type: '지역아동센터', children: 35, region: 'gyeongnam', x: 294, y: 340, distanceKm: 325.5, verified: true, story: '방과 후 프로그램과 야간 돌봄을 함께 운영합니다.' },
];

export const requests = [
  { id: 'req-01', orgId: 'org-01', itemId: 'item-01', neededQty: 20, receivedQty: 12, date: '2025-01-29', status: 'open' },
  { id: 'req-02', orgId: 'org-01', itemId: 'item-08', neededQty: 10, receivedQty: 3, date: '2025-01-28', status: 'open' },
  { id: 'req-03', orgId: 'org-01', itemId: 'item-06', neededQty: 15, receivedQty: 10, date: '2025-01-27', status: 'open' },
  { id: 'req-04', orgId: 'org-02', itemId: 'item-01', neededQty: 12, receivedQty: 8, date: '2025-01-26', status: 'open' },
  { id: 'req-05', orgId: 'org-02', itemId: 'item-10', neededQty: 20, receivedQty: 14, date: '2025-01-25', status: 'open' },
  { id: 'req-06', orgId: 'org-03', itemId: 'item-02', neededQty: 15, receivedQty: 7, date: '2025-01-24', status: 'open' },
  { id: 'req-07', orgId: 'org-03', itemId: 'item-05', neededQty: 8, receivedQty: 3, date: '2025-01-23', status: 'open' },
  { id: 'req-08', orgId: 'org-04', itemId: 'item-03', neededQty: 10, receivedQty: 7, date: '2025-01-22', status: 'open' },
  { id: 'req-09', orgId: 'org-04', itemId: 'item-04', neededQty: 15, receivedQty: 11, date: '2025-01-21', status: 'open' },
  { id: 'req-10', orgId: 'org-05', itemId: 'item-11', neededQty: 6, receivedQty: 2, date: '2025-01-20', status: 'open' },
  { id: 'req-11', orgId: 'org-05', itemId: 'item-01', neededQty: 18, receivedQty: 11, date: '2025-01-19', status: 'open' },
  { id: 'req-12', orgId: 'org-06', itemId: 'item-02', neededQty: 25, receivedQty: 10, date: '2025-01-18', status: 'open' },
  { id: 'req-13', orgId: 'org-06', itemId: 'item-06', neededQty: 20, receivedQty: 13, date: '2025-01-17', status: 'open' },
  { id: 'req-14', orgId: 'org-07', itemId: 'item-09', neededQty: 8, receivedQty: 2, date: '2025-01-16', status: 'open' },
  { id: 'req-15', orgId: 'org-07', itemId: 'item-12', neededQty: 30, receivedQty: 28, date: '2025-01-15', status: 'open' },
  { id: 'req-16', orgId: 'org-08', itemId: 'item-07', neededQty: 20, receivedQty: 6, date: '2025-01-14', status: 'open' },
  { id: 'req-17', orgId: 'org-08', itemId: 'item-04', neededQty: 12, receivedQty: 12, date: '2025-01-13', status: 'closed' },
];

// ==========================================
// 2. API ENDPOINTS
// ==========================================

/** GET /api/categories */
router.get('/categories', (req: Request, res: Response) => {
  res.json({ success: true, data: CATEGORIES });
});

/** GET /api/items (검색, 카테고리 필터링) */
router.get('/items', (req: Request, res: Response) => {
  const { category, query } = req.query;

  let result = items;

  if (category && category !== 'all') {
    result = result.filter((i) => i.category === category);
  }

  if (query) {
    const searchStr = String(query).toLowerCase();
    result = result.filter((i) => i.name.toLowerCase().includes(searchStr));
  }

  res.json({ success: true, data: result });
});

/** GET /api/items/:id (특정 물품 단건 조회) */
router.get('/items/:id', (req: Request, res: Response) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  res.json({ success: true, data: item });
});

/** GET /api/organizations (기관 목록 조회) */
router.get('/organizations', (req: Request, res: Response) => {
  res.json({ success: true, data: organizations, count: organizations.length });
});

/** GET /api/organizations/:id (특정 기관 상세 조회) */
router.get('/organizations/:id', (req: Request, res: Response) => {
  const org = organizations.find((o) => o.id === req.params.id);
  if (!org) {
    return res.status(404).json({ success: false, message: 'Organization not found' });
  }
  res.json({ success: true, data: org });
});

/** GET /api/requests (물품 요청 내역 목록) */
router.get('/requests', (req: Request, res: Response) => {
  const { itemId, orgId } = req.query;
  let result = requests;

  if (itemId) {
    result = result.filter((r) => r.itemId === itemId);
  }

  if (orgId) {
    result = result.filter((r) => r.orgId === orgId);
  }

  res.json({ success: true, data: result });
});

/** GET /api/donations (기부/후원 내역) */
router.get('/donations', (req: Request, res: Response) => {
  const { orgId } = req.query;
  let result = donations;

  if (orgId) {
    result = result.filter((d) => d.orgId === orgId);
  }

  res.json({ success: true, data: result });
});

export default router;