export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="inline-flex gap-1 rounded-xl bg-hairline p-1">
      {tabs.map(({ key, label, Icon, badge }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition ${
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
  );
}