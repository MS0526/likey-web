import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Heart, LogOut, Search, ShoppingCart } from 'lucide-react';
import { useAuth, useLogout } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Container from './Container';

export default function Header({ query, onQueryChange, orgCount }) {
  const { user } = useAuth();
  const handleLogout = useLogout();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, c) => sum + c.qty, 0);

  return (
    <header className="bg-white">
      <Container className="flex items-center gap-4 py-3">
        <Link to="/" className="shrink-0 text-subtle">
          <ArrowLeft size={18} />
        </Link>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Heart size={18} className="fill-brand text-brand" />
          <span className="whitespace-nowrap text-sm text-ink">나눔카트</span>
        </Link>

        <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full bg-cream px-4 py-2">
          <Search size={15} className="text-subtle" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="물품·기관 검색..."
            className="w-full bg-transparent text-sm text-ink outline-none"
          />
        </div>

        <span className="shrink-0 whitespace-nowrap text-sm text-brand">{orgCount}개 기관 등록</span>

        <Link
          to="/feed"
          className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-subtle transition hover:text-ink"
        >
          <Camera size={15} />
          후원 인증
        </Link>

        {user.role !== 'org' && (
          <button
            onClick={() => navigate('/cart')}
            className="relative shrink-0 text-subtle transition hover:text-ink"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {user.role ? (
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm text-subtle transition hover:text-ink"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        ) : (
          <Link
            to="/auth"
            className="shrink-0 whitespace-nowrap text-sm text-subtle transition hover:text-ink"
          >
            로그인
          </Link>
        )}
      </Container>
    </header>
  );
}