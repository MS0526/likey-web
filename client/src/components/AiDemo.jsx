import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Send } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { fetchRecommendation } from '../utils/recommend';
import { formatWon } from '../utils/urgency';
import { runWithTimeoutUX, SLOW_HINT_TEXT, TIMEOUT_TEXT } from '../utils/aiTimeout';
import RecommendCard from './RecommendCard';

const BUDGETS = [20000, 30000, 50000];

const SAMPLE_CARDS = [
  { icon: '💰', q: '3만원으로 후원하고 싶어요', desc: '예산에 맞는 물품을 찾아드려요' },
  { icon: '👶', q: '7살 아이들에게 좋을 만한 게 뭐야?', desc: '연령대에 맞는 물품을 추천해요' },
  { icon: '🏫', q: '초등학생 학용품 추천해줘', desc: '상황에 맞는 물품을 골라드려요' },
  { icon: '🚨', q: '지금 가장 급한 곳은 어디야?', desc: '도움이 시급한 기관을 알려드려요' },
];

export default function AiDemo() {
  const { requests } = useDonation();
  const { user, homePath } = useAuth();
  const { role } = user;
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [budget, setBudget] = useState(30000);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowHint, setSlowHint] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [result, setResult] = useState(null);
  const [lastAttempt, setLastAttempt] = useState({ query: null, budget: 30000 });

  /**
   * fetchRecommendation 자체는 항상 결과를 반환하지만(로컬 폴백 보장), Render 무료 티어처럼
   * 진짜 응답이 30초 넘게 걸리는 경우까지 마냥 기다리게 두지 않는다.
   * 8초 경과 시 안내 문구, 30초 경과 시 로딩을 풀고 재시도 UI를 보여준다 — 이후 다른 버튼도
   * 즉시 다시 조작 가능해진다. finally 없이도 onTimeout/onSettle 양쪽에서 반드시 loading을 해제한다.
   */
  const runRecommend = async (query, budgetForRequest) => {
    setLoading(true);
    setSlowHint(false);
    setTimedOut(false);
    setLastAttempt({ query, budget: budgetForRequest });

    await runWithTimeoutUX(
      (signal) => fetchRecommendation({ budget: budgetForRequest, query, requests, signal }),
      {
        onSlow: () => setSlowHint(true),
        onTimeout: () => {
          setLoading(false);
          setSlowHint(false);
          setTimedOut(true);
        },
        onSettle: (res) => {
          setLoading(false);
          setSlowHint(false);
          setTimedOut(false);
          setResult(res);
        },
      }
    );
  };

  const handleRetry = () => runRecommend(lastAttempt.query, lastAttempt.budget);

  useEffect(() => {
    runRecommend(null, budget);
  }, []);

  const handleBudgetClick = (b) => {
    setBudget(b);
    setInput('');
    runRecommend(null, b);
  };

  const sendQuery = (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    runRecommend(trimmed, budget);
  };

  const handleSend = () => {
    sendQuery(input);
  };

  const handleSample = (q) => {
    setInput(q);
    sendQuery(q);
  };

  const linkFor = (item) => (role ? `/items/${item.id}` : `/auth?next=/items/${item.id}`);

  /** 추천 물품 전체를 순서대로 후원할 수 있게 queue·qty를 쿼리로 담아 첫 물품으로 이동한다. */
  const queueHref = () => {
    const picks = result.picks;
    const queue = picks.map((p) => p.item.id).join(',');
    const qty = picks.map((p) => p.qty).join(',');
    const target = `/items/${picks[0].item.id}?queue=${queue}&qty=${qty}`;
    return role ? target : `/auth?next=${encodeURIComponent(target)}`;
  };

  const handleAddAllToCart = () => {
    if (!result?.picks?.length) return;
    result.picks.forEach((p) => addToCart({ itemId: p.item.id, orgId: p.org.id, qty: p.qty }));
    navigate(role ? '/cart' : `/auth?next=${encodeURIComponent('/cart')}`);
  };

  return (
    <section className="bg-white px-6 py-20">
      <p className="text-center text-xs text-accent-ink">후원 초보자를 위한</p>
      <h2 className="mt-2 text-center text-2xl leading-snug text-ink">
        얼마를 후원해야 할지<br />모르겠나요?
      </h2>
      <p className="mt-4 text-center text-sm text-subtle">
        금액이나 궁금한 점을 물어보시면 AI가 지금 가장 필요한 물품을 찾아드려요
      </p>

      <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE_CARDS.map(({ icon, q, desc }) => (
          <button
            key={q}
            onClick={() => handleSample(q)}
            disabled={loading}
            className="flex flex-col items-start gap-1.5 rounded-xl border border-hairline bg-cream p-4 text-left transition hover:border-accent disabled:opacity-40"
          >
            <span className="text-xl">{icon}</span>
            <span className="text-sm text-ink">{q}</span>
            <span className="text-xs text-subtle">{desc}</span>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          placeholder="금액이나 궁금한 점을 물어보세요"
          className="flex-1 rounded-lg border border-hairline px-4 py-3 text-sm text-ink outline-none focus:border-brand disabled:bg-cream"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand text-white disabled:opacity-40"
          aria-label="전송"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
        {BUDGETS.map((b) => (
          <button
            key={b}
            onClick={() => handleBudgetClick(b)}
            disabled={loading}
            className={`rounded-full px-6 py-2.5 text-sm transition disabled:opacity-40 ${
              budget === b && !input
                ? 'bg-accent text-ink'
                : 'border border-hairline bg-white text-subtle hover:border-accent'
            }`}
          >
            {b / 10000}만원
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-hairline bg-cream p-6">
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-subtle" />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-subtle"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-subtle"
                style={{ animationDelay: '300ms' }}
              />
            </span>
            {slowHint && <span className="text-xs text-subtle">{SLOW_HINT_TEXT}</span>}
          </div>
        ) : timedOut ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-center text-sm text-subtle">{TIMEOUT_TEXT}</p>
            <button
              onClick={handleRetry}
              className="rounded-full border border-brand px-5 py-2 text-xs text-brand transition hover:bg-brand hover:text-white"
            >
              다시 시도
            </button>
          </div>
        ) : result?.picks?.length > 0 ? (
          <>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                <Sparkles size={15} className="text-accent-ink" />
              </span>
              <p className="text-sm leading-relaxed text-ink">{result.message}</p>
            </div>

            <div className="mt-4 space-y-3">
              {result.picks.map((p) => (
                <RecommendCard key={p.req.id} pick={p} to={linkFor(p.item)} />
              ))}
            </div>

            {result.spent != null && (
              <p className="mt-3 text-center text-xs text-subtle">
                {budget != null && budget - result.spent > 0
                  ? `남은 ${formatWon(budget - result.spent)}원으로는 다른 물품을 함께 담을 수 있어요`
                  : null}
              </p>
            )}
          </>
        ) : (
          <p className="py-8 text-center text-sm text-subtle">
            {result?.message || '해당 조건으로 후원 가능한 물품이 없습니다. 금액을 올려보세요.'}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {result?.picks?.length > 0 ? (
          <div className="flex w-full max-w-sm flex-col gap-2.5 sm:flex-row">
            <Link
              to={queueHref()}
              className="flex-1 rounded-full bg-accent px-8 py-3.5 text-center text-sm text-ink"
            >
              이대로 후원 시작하기
            </Link>
            <button
              onClick={handleAddAllToCart}
              className="flex-1 rounded-full border border-accent px-8 py-3.5 text-sm text-accent-ink"
            >
              모두 장바구니에 담기
            </button>
          </div>
        ) : (
          <Link to={homePath} className="inline-block rounded-full bg-accent px-8 py-3.5 text-sm text-ink">
            이대로 후원 시작하기
          </Link>
        )}
        <p className="text-xs text-subtle">회원가입 후 기관이 수락하면 배송이 시작됩니다</p>
      </div>
    </section>
  );
}
