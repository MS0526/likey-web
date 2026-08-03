import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';

export default function OrgHeader({ organization }) {
  const initial = organization.name.charAt(0);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <Link to="/about" className="text-subtle">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <Heart size={18} className="fill-brand text-brand" />
          <span className="text-sm text-ink">라이키</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs text-white">
          {initial}
        </div>
        <span className="text-sm text-ink">{organization.name}</span>
      </div>
    </header>
  );
}