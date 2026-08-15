import { CATEGORIES } from '../data/items';

export default function CategoryNav({ selected, onSelect }) {
  const tabs = [{ key: 'all', label: '전체' }, ...CATEGORIES];

  return (
    <div className="relative">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {tabs.map(({ key, label }) => {
          const active = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-hairline bg-white text-subtle hover:border-brand'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream to-transparent" />
    </div>
  );
}