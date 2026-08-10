// 한글 숫자 단어(일~구, 십)를 아라비아 숫자로 치환하기 위한 맵.
// "십"은 이 예시들에서 항상 단독으로만 등장하므로(예: "십만원") 값 10으로 바로 치환한다.
const DIGIT_WORDS = {
  일: '1',
  이: '2',
  삼: '3',
  사: '4',
  오: '5',
  육: '6',
  칠: '7',
  팔: '8',
  구: '9',
  십: '10',
};

// 큰 단위부터 순서대로 처리해야 "3만5천"처럼 복합 단위를 만→천 순으로 나눠 계산할 수 있다.
const UNITS = [
  ['만', 10000],
  ['천', 1000],
  ['백', 100],
];

export function parseAmount(input) {
  if (typeof input !== 'string') return null;

  // 1. 쉼표·공백·"원" 제거
  let normalized = input.replace(/\s+/g, '').replace(/,/g, '').replace(/원/g, '');
  if (normalized === '') return null;

  // 2. 한글 숫자를 아라비아 숫자로 변환
  for (const [word, digit] of Object.entries(DIGIT_WORDS)) {
    normalized = normalized.split(word).join(digit);
  }

  // 3. "만", "천", "백" 단위를 순서대로 처리하며 누적
  let total = 0;
  let remaining = normalized;

  for (const [unitChar, unitValue] of UNITS) {
    const idx = remaining.indexOf(unitChar);
    if (idx === -1) continue;

    const countStr = remaining.slice(0, idx);
    const count = countStr === '' ? 1 : Number(countStr); // 단위 앞에 숫자가 없으면 1로 간주
    if (Number.isNaN(count)) return null;

    total += count * unitValue;
    remaining = remaining.slice(idx + 1);
  }

  // 4. 단위가 전혀 없거나, 단위 처리 후 숫자가 남아있으면 그대로 숫자로 해석
  if (remaining !== '') {
    const rest = Number(remaining);
    if (Number.isNaN(rest)) return null; // 5. 숫자를 하나도 찾지 못하면 null
    total += rest;
  }

  return total;
}
