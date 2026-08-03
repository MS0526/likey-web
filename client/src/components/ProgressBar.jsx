export default function ProgressBar({ percent, complete = false }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          complete ? 'bg-brand' : 'bg-accent'
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}