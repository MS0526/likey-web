import { CATEGORIES } from '../data/items';

export default function CategoryNav({ selected, onSelect }) {
  const tabs = [{ key: 'all', label: '전체' }, ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ key, label }) => {
        const active = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
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
  );
}