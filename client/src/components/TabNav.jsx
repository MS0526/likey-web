export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="relative inline-block max-w-full">
      <div className="scrollbar-hide flex gap-1 overflow-x-auto rounded-xl bg-hairline p-1">
        {tabs.map(({ key, label, Icon, badge }) => {
          const on = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition ${
                on ? 'bg-white text-ink' : 'text-subtle'
              }`}
            >
              <Icon size={15} />
              {label}
              {badge > 0 && (
                <span className="rounded-full bg-accent px-1.5 font-mono text-xs text-ink">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-hairline to-transparent" />
    </div>
  );
}