export const organizations = [
  { id: 'org-01', name: '서울 햇살 보육원', type: '보육원', children: 32,
    region: 'gyeonggi', x: 159, y: 151, distanceKm: 3.4, verified: true,
    story: '0세부터 18세까지 32명의 아이들이 함께 생활하고 있습니다.' },
  { id: 'org-02', name: '수원 늘봄아동센터', type: '지역아동센터', children: 24,
    region: 'gyeonggi', x: 163, y: 175, distanceKm: 7.8, verified: true,
    story: '방과 후 돌봄이 필요한 아동 24명을 지원하고 있습니다.' },
  { id: 'org-03', name: '용인 참사랑의집', type: '아동양육시설', children: 18,
    region: 'gyeonggi', x: 172, y: 177, distanceKm: 12.1, verified: true,
    story: '가정 밖 청소년들의 자립을 돕는 시설입니다.' },
  { id: 'org-04', name: '대전 씨앗의집', type: '보육원', children: 21,
    region: 'chungnam', x: 186, y: 248, distanceKm: 141.2, verified: true,
    story: '미취학 아동 위주로 21명이 생활하고 있습니다.' },
  { id: 'org-05', name: '전주 밝은아이들', type: '지역아동센터', children: 29,
    region: 'jeonbuk', x: 170, y: 290, distanceKm: 196.4, verified: true,
    story: '저소득 가정 아동의 학습과 급식을 지원합니다.' },
  { id: 'org-06', name: '광주 다솜의집', type: '보육원', children: 27,
    region: 'jeonnam', x: 151, y: 342, distanceKm: 241.0, verified: true,
    story: '형제자매가 함께 지낼 수 있는 가정형 보육 시설입니다.' },
  { id: 'org-07', name: '대구 새싹의집', type: '아동양육시설', children: 23,
    region: 'gyeongbuk', x: 263, y: 286, distanceKm: 237.8, verified: true,
    story: '장애 아동을 포함해 23명이 생활하는 시설입니다.' },
  { id: 'org-08', name: '부산 온빛아동센터', type: '지역아동센터', children: 35,
    region: 'gyeongnam', x: 294, y: 340, distanceKm: 325.5, verified: true,
    story: '방과 후 프로그램과 야간 돌봄을 함께 운영합니다.' },
];

export const getOrganizationById = (id) =>
  organizations.find((org) => org.id === id);

export const getRegionCounts = () =>
  organizations.reduce((acc, o) => {
    acc[o.region] = (acc[o.region] ?? 0) + 1;
    return acc;
  }, {});