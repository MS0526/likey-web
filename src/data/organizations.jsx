export const organizations = [
  {
    id: 'org-01',
    name: '성남 햇살보육원',
    type: '보육원',
    region: '경기',
    distanceKm: 3.4,
    verified: true,
    story: '0세부터 18세까지 32명의 아이들이 함께 생활하고 있습니다.',
  },
  {
    id: 'org-02',
    name: '수원 늘봄아동센터',
    type: '지역아동센터',
    region: '경기',
    distanceKm: 7.8,
    verified: true,
    story: '방과 후 돌봄이 필요한 아동 24명을 지원하고 있습니다.',
  },
  {
    id: 'org-03',
    name: '용인 참사랑의집',
    type: '아동양육시설',
    region: '경기',
    distanceKm: 12.1,
    verified: true,
    story: '가정 밖 청소년들의 자립을 돕는 시설입니다.',
  },
  {
    id: 'org-04',
    name: '평택 하늘꿈터',
    type: '보육원',
    region: '경기',
    distanceKm: 18.6,
    verified: true,
    story: '미취학 아동 위주로 18명이 생활하고 있습니다.',
  },
];

export const getOrganizationById = (id) =>
  organizations.find((org) => org.id === id);