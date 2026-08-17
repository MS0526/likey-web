// 카테고리는 순위가 아니라 정체성이므로, 표시 순서(qty 내림차순)와 무관하게
// 항상 같은 카테고리가 같은 색을 갖도록 고정 매핑을 쓴다.
// 색상은 dataviz 카테고리 팔레트(순열 검증 완료)의 앞 6개 슬롯.
const CATEGORY_COLORS = {
  food: '#2a78d6',
  goods: '#eb6834',
  toy: '#1baf7a',
  clothing: '#eda100',
  medicine: '#e87ba4',
  edu: '#008300',
};

export default function CategoryBarChart({ data }) {
  if (data.length === 0) {
    return (
      <p className="rounded-xl border border-hairline bg-white py-16 text-center text-sm text-subtle">
        아직 후원받은 물품이 없습니다.
      </p>
    );
  }

  const max = Math.max(...data.map((d) => d.qty));

  return (
    <div className="rounded-xl border border-hairline bg-white p-5">
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-subtle">{d.label}</span>
            <div className="relative h-3 flex-1 border-l border-hairline">
              <div
                className="h-full rounded-r-[4px]"
                style={{
                  width: `${Math.max(4, (d.qty / max) * 100)}%`,
                  backgroundColor: CATEGORY_COLORS[d.key],
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-ink">{d.qty}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}
