/** 기관이 준비한 후원 인증 — published를 true로 바꾸면 /feed에 노출된다 */
export const proofs = [
  {
    id: 'proof-01',
    orgId: 'org-01',
    itemId: 'item-01',
    qty: 3,
    donor: '㈜나눔코리아',
    anonymous: false,
    date: '2026-08-12',
    message: '보내주신 쌀로 아이들이 든든한 한 끼를 먹었습니다. 감사합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1588075592806-bbe6da990469?w=400&h=300&fit=crop&auto=format', // 임시 이미지 — 시연 때 실제 사진으로 교체
    published: false,
  },
  {
    id: 'proof-02',
    orgId: 'org-01',
    itemId: 'item-06',
    qty: 5,
    donor: '㈜그린코리아',
    anonymous: false,
    date: '2026-08-11',
    message: '따뜻한 겨울 내복 덕분에 아이들이 추위 걱정 없이 지내고 있어요.',
    imageUrl: 'https://images.unsplash.com/photo-1675630828719-e5e4e5a6f76d?w=400&h=300&fit=crop&auto=format', // 임시 이미지 — 시연 때 실제 사진으로 교체
    published: false,
  },
  {
    id: 'proof-03',
    orgId: 'org-01',
    itemId: 'item-11',
    qty: 1,
    donor: '최민수',
    anonymous: true,
    date: '2026-08-10',
    message: '새 책이 생겨 아이들이 서로 먼저 읽겠다고 줄을 섰답니다. 좋은 마음 감사드려요.',
    imageUrl: 'https://images.unsplash.com/photo-1532789339108-2ebc484efbf1?w=400&h=300&fit=crop&auto=format', // 임시 이미지 — 시연 때 실제 사진으로 교체
    published: false,
  },
  {
    id: 'proof-04',
    orgId: 'org-01',
    itemId: 'item-10',
    qty: 8,
    donor: '박민준',
    anonymous: false,
    date: '2026-08-09',
    message: '색연필과 스케치북으로 아이들이 그림 그리는 시간을 정말 좋아해요. 고맙습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop&auto=format', // 임시 이미지 — 시연 때 실제 사진으로 교체
    published: false,
  },
];

export const getProofById = (id) => proofs.find((p) => p.id === id);
