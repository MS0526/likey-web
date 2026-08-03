export const CATEGORIES = [
  { key: 'clothing', label: '의류' },
  { key: 'food', label: '음식' },
  { key: 'furniture', label: '가구' },
  { key: 'book', label: '도서' },
  { key: 'toy', label: '오락' },
];

export const items = [
  {
    id: 'item-01',
    name: '유아용 분유 800g',
    category: 'food',
    price: 24000,
    weight: '800g',
    description: '0~12개월 영아용 조제분유입니다.',
  },
  {
    id: 'item-02',
    name: '아동용 반팔 티셔츠',
    category: 'clothing',
    price: 8900,
    weight: '150g',
    description: '면 100% 소재의 아동용 티셔츠입니다. 100~140 사이즈.',
  },
  {
    id: 'item-03',
    name: '초등 학습 노트 10권 세트',
    category: 'book',
    price: 8500,
    weight: '1.2kg',
    description: '초등학생용 줄노트 10권 묶음입니다.',
  },
  {
    id: 'item-04',
    name: '겨울 이불 세트',
    category: 'furniture',
    price: 39000,
    weight: '2.4kg',
    description: '싱글 사이즈 극세사 이불과 베개 커버 세트입니다.',
  },
  {
    id: 'item-05',
    name: '창작 동화책 5권 세트',
    category: 'book',
    price: 46000,
    weight: '1.8kg',
    description: '유아~초등 저학년용 창작 동화책 5권입니다.',
  },
  {
    id: 'item-06',
    name: '블록 놀이 세트',
    category: 'toy',
    price: 32000,
    weight: '900g',
    description: '3세 이상 사용 가능한 대형 블록 120피스입니다.',
  },
  {
    id: 'item-07',
    name: '즉석밥 24개입',
    category: 'food',
    price: 21600,
    weight: '5.0kg',
    description: '210g 즉석밥 24개 묶음입니다.',
  },
  {
    id: 'item-08',
    name: '학생용 책상 의자',
    category: 'furniture',
    price: 54000,
    weight: '6.5kg',
    description: '높이 조절이 가능한 아동용 학습 의자입니다.',
  },
];

export const getItemById = (id) => items.find((item) => item.id === id);

export const getCategoryLabel = (key) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? '기타';