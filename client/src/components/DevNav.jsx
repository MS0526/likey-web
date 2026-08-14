import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '첫화면', end: true },
  { to: '/about', label: '소개' },
  { to: '/auth', label: '유형선택' },
  { to: '/login/user', label: '로그인' },
  { to: '/market', label: '마켓' },
  { to: '/cart', label: '장바구니' },
  { to: '/feed', label: '후원 인증' },
  { to: '/org', label: '기관들' },
];

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
    </nav>
  );
}