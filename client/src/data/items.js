export const CATEGORIES = [
  { key: 'food', label: '식량' },
  { key: 'goods', label: '공산품' },
  { key: 'toy', label: '장난감' },
  { key: 'clothing', label: '의류' },
  { key: 'medicine', label: '의약품' },
  { key: 'edu', label: '교육용품' },
];

export const items = [
  { id: 'item-01', name: '어린이 쌀 10kg', category: 'food', price: 28000, weight: '10kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    description: '아이들 주식용 백미입니다. 도정일 기준 2주 이내 제품으로 배송됩니다.' },
  { id: 'item-02', name: '라면 혼합 세트 (40봉)', category: 'food', price: 32000, weight: '5.2kg',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format',
    description: '순한맛 위주로 구성된 어린이용 라면 세트입니다.' },
  { id: 'item-03', name: '어린이 샴푸·비누 세트', category: 'goods', price: 15000, weight: '1.4kg',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop&auto=format',
    description: '무향·저자극 성분의 아동용 세면 용품 묶음입니다.' },
  { id: 'item-04', name: '유아 기저귀 (대용량)', category: 'goods', price: 38000, weight: '3.8kg',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&auto=format',
    description: '중형 사이즈 120매 대용량 팩입니다.' },
  { id: 'item-05', name: '레고 클래식 창작 세트', category: 'toy', price: 45000, weight: '900g',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop&auto=format',
    description: '3세 이상 사용 가능한 대형 블록 120피스 구성입니다.' },
  { id: 'item-06', name: '어린이 내복 세트 (겨울용)', category: 'clothing', price: 22000, weight: '400g',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop&auto=format',
    description: '기모 안감 상하의 세트. 100~140 사이즈 선택 가능합니다.' },
  { id: 'item-07', name: '아동 운동화', category: 'clothing', price: 34000, weight: '600g',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
    description: '가벼운 메쉬 소재의 아동용 운동화입니다. 180~230mm.' },
  { id: 'item-08', name: '어린이 종합 비타민', category: 'medicine', price: 18000, weight: '250g',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&auto=format',
    description: '만 3세 이상 복용 가능한 츄어블 형태 종합 비타민입니다.' },
  { id: 'item-09', name: '가정용 상비약 키트', category: 'medicine', price: 26000, weight: '700g',
    image: 'https://images.unsplash.com/photo-1563260324-5ebeedc8af7c?w=400&h=300&fit=crop&auto=format',
    description: '해열 패치, 소독약, 밴드 등으로 구성된 기본 구급 키트입니다.' },
  { id: 'item-10', name: '색연필·스케치북 세트', category: 'edu', price: 12000, weight: '800g',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop&auto=format',
    description: '36색 색연필과 스케치북 3권으로 구성된 미술 용품입니다.' },
  { id: 'item-11', name: '아동 도서 패키지', category: 'edu', price: 55000, weight: '2.6kg',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop&auto=format',
    description: '유아~초등 저학년용 창작 동화책 12권 묶음입니다.' },
  { id: 'item-12', name: '초등 학습 노트 10권 세트', category: 'edu', price: 8500, weight: '1.2kg',
    image: 'https://images.unsplash.com/photo-1733878859915-dc074dd9ee27?w=400&h=300&fit=crop&auto=format',
    description: '초등학생용 줄노트 10권 묶음입니다.' },
];

export const getItemById = (id) => items.find((item) => item.id === id);

export const getCategoryLabel = (key) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? '기타';