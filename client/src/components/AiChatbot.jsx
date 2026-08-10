import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchRecommendation } from '../utils/recommend';
import { formatWon } from '../utils/urgency';
import { parseAmount } from '../utils/parseAmount';
import { detectIntent } from '../utils/chatIntent';
import RecommendCard from './RecommendCard';

const QUICK = [10000, 30000, 50000, 100000];

const INTENT_RESPONSES = {
  greeting: '안녕하세요! 후원도우미예요. 후원하실 금액을 알려주시면 지금 가장 필요한 물품을 찾아드릴게요.',
  thanks: '도움이 되었다니 기뻐요. 더 궁금한 게 있으면 언제든 물어보세요!',
  help: "저는 예산에 맞는 후원 물품을 추천해 드려요. '3만원'처럼 금액을 알려주시면 지금 가장 급한 기관과 물품을 찾아드립니다.",
};

const NO_BUDGET_HINT = '예산을 알려주시면 더 정확하게 추천드릴게요.';

export default function AiChatbot() {
  const { requests } = useDonation();
  const { role } = useAuth();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastBudget, setLastBudget] = useState(null);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '안녕하세요! 후원하실 금액을 알려주시면 지금 가장 필요한 물품을 찾아드릴게요.',
    },
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const pushMessage = (message) => setMessages((prev) => [...prev, message]);

  /** query·budget으로 추천을 가져와 봇 말풍선을 추가한다. budget이 없으면 예산 안내를 덧붙인다. */
  const recommend = async (query, budget) => {
    setLoading(true);
    try {
      const result = await fetchRecommendation({ budget, query, requests });
      pushMessage({
        type: 'bot',
        text: result.message,
        picks: result.picks,
        rest: budget != null ? budget - result.spent : null,
        source: result.source,
      });
      if (budget == null) {
        pushMessage({ type: 'bot', text: NO_BUDGET_HINT });
      }
    } catch {
      pushMessage({ type: 'bot', text: '추천을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (amount) => {
    if (loading) return;
    pushMessage({ type: 'user', text: `${formatWon(amount)}원` });
    setLastBudget(amount);
    recommend(null, amount);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    pushMessage({ type: 'user', text: trimmed });
    setInput('');

    const intent = detectIntent(trimmed);
    if (intent === 'greeting' || intent === 'thanks' || intent === 'help') {
      pushMessage({ type: 'bot', text: INTENT_RESPONSES[intent] });
      return;
    }

    const amount = parseAmount(trimmed);
    if (amount !== null) {
      if (amount < 1000) {
        pushMessage({ type: 'bot', text: '1,000원 이상의 금액을 입력해 주세요.' });
        return;
      }
      setLastBudget(amount);
      recommend(trimmed, amount);
      return;
    }

    // 금액 없는 자유 질문 → 이전에 기억한 예산(없으면 null)으로 추천
    recommend(trimmed, lastBudget);
  };

  const linkFor = (pick) =>
    role ? `/items/${pick.item.id}` : `/auth?next=/items/${pick.item.id}`;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:scale-105"
        aria-label="후원도우미 AI 열기"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-brand px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm text-white">후원도우미</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/70 transition hover:text-white"
          aria-label="닫기"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-cream p-4">
        {messages.map((m, i) =>
          m.type === 'user' ? (
            <div key={i} className="flex justify-end">
              <span className="rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm text-white">
                {m.text}
              </span>
            </div>
          ) : (
            <div key={i} className="space-y-2">
              <div className="flex justify-start">
                <span className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-sm leading-relaxed text-ink">
                  {m.text}
                </span>
              </div>

              {m.picks?.map((p) => (
                <RecommendCard key={p.req.id} pick={p} to={linkFor(p)} />
              ))}

              {m.picks?.length > 0 && m.rest > 0 && (
                <p className="text-center text-xs text-subtle">
                  남은 {formatWon(m.rest)}원으로는 다른 물품을 더 담을 수 있어요
                </p>
              )}

              {import.meta.env.DEV && m.source && (
                <p className="text-center text-xs text-subtle">[{m.source}]</p>
              )}
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start">
            <span className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3">
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
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="border-t border-hairline bg-white p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK.map((b) => (
            <button
              key={b}
              onClick={() => handleQuick(b)}
              disabled={loading}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-subtle transition hover:border-brand hover:text-brand disabled:opacity-40"
            >
              {b / 10000}만원
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            placeholder="금액이나 궁금한 점을 물어보세요"
            className="flex-1 rounded-lg border border-hairline px-3 py-2 text-sm text-ink outline-none focus:border-brand disabled:bg-cream"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white disabled:opacity-40"
            aria-label="전송"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}