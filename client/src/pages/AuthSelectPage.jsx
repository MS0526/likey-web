import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Gift, Users, Store, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthSelectPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [notice, setNotice] = useState(false);

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
      ready: true,
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
      ready: true,
    },
    {
      key: 'seller',
      to: null,
      Icon: Store,
      title: '판매자 회원',
      desc: '보육원, 아동센터 등에 후원될 고품질의 물건을 제공합니다.',
      iconBg: 'bg-hairline',
      iconColor: 'text-subtle',
      linkColor: 'text-subtle',
      ready: false,
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between bg-white px-6 py-3">
        <Link to="/" className="flex items-center gap-2 text-sm text-subtle">
          <ArrowLeft size={16} /> 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <Heart size={18} className="fill-brand text-brand" />
          <span className="text-sm text-ink">라이키</span>
        </div>
        <div className="w-16" />
      </header>

      <div className="px-6 py-16">
        <h1 className="text-center text-3xl text-ink">시작하기</h1>
        <p className="mt-3 text-center text-sm text-subtle">회원 유형을 선택하여 로그인하세요</p>

        {next && (
          <p className="mt-4 text-center text-xs text-accent-ink">
            로그인하면 선택하신 물품으로 바로 이동합니다
          </p>
        )}

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
          {TYPES.map((t) => {
            const inner = (
              <>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${t.iconBg}`}>
                  <t.Icon size={22} className={t.iconColor} />
                </div>
                <p className="mt-6 text-lg text-ink">{t.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-subtle">{t.desc}</p>
                <span className={`mt-6 flex items-center gap-1 text-sm ${t.linkColor}`}>
                  {t.ready ? '로그인하기' : '준비 중'}
                  {t.ready && <ChevronRight size={14} />}
                </span>
              </>
            );

            const base = 'rounded-2xl bg-white p-7 text-left transition';

            return t.ready ? (
              <Link
                key={t.key}
                to={t.to}
                className={`${base} border border-hairline hover:border-brand`}
              >
                {inner}
              </Link>
            ) : (
              <button
                key={t.key}
                onClick={() => setNotice(true)}
                className={`${base} border border-hairline opacity-70`}
              >
                {inner}
              </button>
            );
          })}
        </div>

        {notice && (
          <p className="mt-8 text-center text-sm text-accent-ink">
            판매자 등록은 준비 중입니다. 현재는 플랫폼이 직접 매입한 물품만 제공됩니다.
          </p>
        )}

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
      </div>
    </div>
  );
}