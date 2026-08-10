import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, LogOut, Search } from 'lucide-react';
import { useAuth, useLogout } from '../contexts/AuthContext';

export default function Header({ query, onQueryChange, orgCount }) {
  const { user } = useAuth();
  const handleLogout = useLogout();

  return (
    <header className="flex items-center gap-4 bg-white px-6 py-3">
      <Link to="/about" className="text-subtle">
        <ArrowLeft size={18} />
      </Link>

      <Link to="/" className="flex items-center gap-2">
        <Heart size={18} className="fill-brand text-brand" />
        <span className="text-sm text-ink">라이키</span>
      </Link>

      <div className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-full bg-cream px-4 py-2">
        <Search size={15} className="text-subtle" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="물품 검색..."
          className="w-full bg-transparent text-sm text-ink outline-none"
        />
      </div>

      <span className="whitespace-nowrap text-sm text-brand">{orgCount}개 기관 등록</span>

      {user.role ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 whitespace-nowrap text-sm text-subtle transition hover:text-ink"
        >
          <LogOut size={14} />
          로그아웃
        </button>
      ) : (
        <Link
          to="/auth"
          className="whitespace-nowrap text-sm text-subtle transition hover:text-ink"
        >
          로그인
        </Link>
      )}
    </header>
  );
}