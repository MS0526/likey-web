import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Gift, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/Container';

export default function AuthSelectPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // 외부 URL 리다이렉트 방지 — 내부 경로만 허용
  const raw = params.get('next');
  const next = raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : null;

  const TYPES = [
    {
      key: 'user',
      to: next ? `/login/user?next=${encodeURIComponent(next)}` : '/login/user',
      Icon: Gift,
      title: '개인 회원',
      desc: '후원하고 싶은 개인 또는 기업. 마켓에서 물품을 선택해 기관에 직접 후원합니다.',
      iconBg: 'bg-brand-soft',
      iconColor: 'text-brand',
      linkColor: 'text-brand',
    },
    {
      key: 'org',
      to: '/login/org',
      Icon: Users,
      title: '기관 회원',
      desc: '보육원, 아동센터 등 후원을 받는 기관. 물품 요청 및 수락 관리를 합니다.',
      iconBg: 'bg-accent-soft',
      iconColor: 'text-accent-ink',
      linkColor: 'text-accent-ink',
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white">
        <Container className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-subtle">
            <ArrowLeft size={16} /> 돌아가기
          </Link>
          <div className="flex items-center gap-2">
            <Heart size={18} className="fill-brand text-brand" />
            <span className="whitespace-nowrap text-sm text-ink">나눔카트</span>
          </div>
          <div className="w-16" />
        </Container>
      </header>

      <Container className="py-16">
        <h1 className="text-center text-3xl text-ink">시작하기</h1>
        <p className="mt-3 text-center text-sm text-subtle">회원 유형을 선택하여 로그인하세요</p>

        {next && (
          <p className="mt-4 text-center text-xs text-accent-ink">
            로그인하면 선택하신 물품으로 바로 이동합니다
          </p>
        )}

        <div className="mx-auto mt-12 grid max-w-2xl gap-5 md:grid-cols-2">
          {TYPES.map((t) => (
            <Link
              key={t.key}
              to={t.to}
              className="rounded-2xl border border-hairline bg-white p-7 text-left transition hover:border-brand"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${t.iconBg}`}>
                <t.Icon size={22} className={t.iconColor} />
              </div>
              <p className="mt-6 text-lg text-ink">{t.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-subtle">{t.desc}</p>
              <span className={`mt-6 flex items-center gap-1 text-sm ${t.linkColor}`}>
                로그인하기
                <ChevronRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              login('guest');
              navigate(next ?? '/market');
            }}
            className="text-sm text-subtle underline underline-offset-4"
          >
            로그인 없이 둘러볼래요
          </button>
        </div>
      </Container>
    </div>
  );
}