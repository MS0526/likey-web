import { NavLink } from 'react-router-dom';
import { clearAllState } from '../lib/storage';

const links = [
  { to: '/', label: '첫화면', end: true },
  { to: '/auth', label: '유형선택' },
  { to: '/login/user', label: '로그인' },
  { to: '/market', label: '마켓' },
  { to: '/cart', label: '장바구니' },
  { to: '/feed', label: '후원 인증' },
  { to: '/org', label: '기관들' },
];

function handleReset() {
  if (!window.confirm('저장된 후원 데이터를 모두 지우고 시드 상태로 되돌릴까요?')) return;
  clearAllState();
  window.location.reload();
}

export default function DevNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3 text-sm">
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `rounded px-3 py-1 ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={handleReset}
          className="rounded px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100"
        >
          데이터 초기화
        </button>
      )}
    </nav>
  );
}