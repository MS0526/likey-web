export default function MetricCard({ value, unit, label, accent = false }) {
  return (
    <div className="rounded-xl border border-hairline bg-white px-5 py-4">
      <p className={`font-mono text-2xl ${accent ? 'text-accent-ink' : 'text-brand'}`}>
        {value}
        <span className="text-sm">{unit}</span>
      </p>
      <p className="mt-1.5 text-xs text-subtle">{label}</p>
    </div>
  );
}
