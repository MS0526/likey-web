import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Check, ShoppingCart, Sparkles, ArrowRight } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { getItemById, getCategoryLabel } from '../data/items';
import { getOrganizationById } from '../data/organizations';
import { useDonation } from '../contexts/DonationContext';
import { useCart } from '../contexts/CartContext';
import { progressOf, formatWon } from '../utils/urgency';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getRequestsByItem, createDonation } = useDonation();
  const { addToCart } = useCart();

  const item = getItemById(id);

  // AI 추천에서 "이대로 후원 시작하기"로 넘어온 경우, 추천받은 물품 전체를 순서대로 후원할 수 있게 하는 대기열
  const queueIds = (searchParams.get('queue') ?? '').split(',').filter(Boolean);
  const queueQtys = (searchParams.get('qty') ?? '').split(',').filter(Boolean).map(Number);
  const queueIndex = queueIds.indexOf(id);
  const inQueue = queueIndex !== -1;
  const hasNextInQueue = inQueue && queueIndex + 1 < queueIds.length;

  // 이 물품을 요청한 기관 목록 — 긴급 기관을 먼저, 그 안에서는 가까운 순으로 정렬
  const reqs = getRequestsByItem(id)
    .map((r) => ({ ...r, org: getOrganizationById(r.orgId), percent: progressOf(r) }))
    .sort((a, b) => {
      const urgentDiff = (b.urgentQty > 0 ? 1 : 0) - (a.urgentQty > 0 ? 1 : 0);
      return urgentDiff !== 0 ? urgentDiff : a.org.distanceKm - b.org.distanceKm;
    });

  const [orgId, setOrgId] = useState('');
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [added, setAdded] = useState(false);
  const [revealDonor, setRevealDonor] = useState(true);

  // 물품이 바뀔 때(대기열의 다음 물품으로 이동 포함) 선택 상태를 새 물품 기준으로 초기화한다.
  // queue의 qty가 있으면 수량 선택기 초기값으로 사용한다.
  useEffect(() => {
    setOrgId(reqs[0]?.orgId ?? '');
    setDone(false);
    setAdded(false);
    const queuedQty = queueQtys[queueIndex];
    setQty(Number.isFinite(queuedQty) && queuedQty > 0 ? queuedQty : 1);
  }, [id]);

  const picked = reqs.find((r) => r.orgId === orgId);
  // 남은 수량 = 필요 수량 - 이미 받은 수량 - 수락 대기 중인 수량
  const remain = picked ? Math.max(0, picked.neededQty - picked.receivedQty - picked.pendingQty) : 0;

  // 기관을 바꾸거나 남은 수량이 줄어들면 선택 수량이 상한을 넘지 않도록 맞춘다
  useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), Math.max(1, remain)));
  }, [orgId, remain]);

  if (!item) {
    return <p className="p-8 text-sm text-subtle">존재하지 않는 물품입니다.</p>;
  }

  const goToNextQueueItem = () => {
    const nextId = queueIds[queueIndex + 1];
    navigate(`/items/${nextId}?${searchParams.toString()}`);
  };

  const handleDonate = () => {
    if (!picked || remain === 0) return;
    createDonation({
      itemId: item.id,
      orgId,
      qty: Math.min(qty, remain),
      donor: '나 (테스트 후원자)',
      anonymous: !revealDonor,
    });
    setDone(true);
    if (!hasNextInQueue) {
      setTimeout(() => navigate('/market'), 1600);
    }
  };

  const handleAddToCart = () => {
    if (!picked || remain === 0) return;
    addToCart({ itemId: item.id, orgId, qty: Math.min(qty, remain) });
    setAdded(true);
    if (hasNextInQueue) return; // 다음 추천 물품 버튼을 누를 때까지 배너를 유지한다
    if (inQueue) {
      setTimeout(() => navigate('/market'), 1600);
    } else {
      setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center gap-4 bg-white px-6 py-3">
        <Link to="/market" className="text-subtle"><ArrowLeft size={18} /></Link>
        <span className="text-sm text-ink">물품 상세</span>
      </header>

      {inQueue && !done && !added && (
        <div className="flex items-center justify-center gap-2 bg-accent-soft px-4 py-2.5 text-sm text-accent-ink">
          <Sparkles size={14} />
          AI 추천 후원 진행 중 ({queueIndex + 1}/{queueIds.length})
        </div>
      )}

      {done && (
        <div className="flex flex-col items-center gap-3 bg-brand px-4 py-4 text-sm text-white">
          <div className="flex items-center gap-2">
            <Check size={15} />
            결제 완료. {picked.org.name}의 수락을 기다립니다.
          </div>
          {inQueue && (
            hasNextInQueue ? (
              <button
                onClick={goToNextQueueItem}
                className="flex w-full max-w-xs items-center justify-center gap-1.5 rounded-lg bg-white px-5 py-3 text-sm text-brand"
              >
                다음 추천 물품 후원하기 ({queueIndex + 2}/{queueIds.length}) <ArrowRight size={15} />
              </button>
            ) : (
              <p className="text-xs text-white/90">추천 물품을 모두 후원했어요!</p>
            )
          )}
        </div>
      )}

      {added && !done && (
        <div className="flex flex-col items-center gap-3 bg-ink px-4 py-4 text-sm text-white">
          <div className="flex items-center gap-2">
            <ShoppingCart size={15} />
            장바구니에 담았습니다.
          </div>
          {inQueue && (
            hasNextInQueue ? (
              <button
                onClick={goToNextQueueItem}
                className="flex w-full max-w-xs items-center justify-center gap-1.5 rounded-lg bg-white px-5 py-3 text-sm text-ink"
              >
                다음 추천 물품 후원하기 ({queueIndex + 2}/{queueIds.length}) <ArrowRight size={15} />
              </button>
            ) : (
              <p className="text-xs text-white/90">추천 물품을 모두 후원했어요!</p>
            )
          )}
        </div>
      )}

      <div className="grid gap-8 px-6 py-8 md:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-xl bg-brand-soft">
          <ImageIcon size={52} className="text-brand opacity-40" />
        </div>

        <div>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs text-brand">
            {getCategoryLabel(item.category)}
          </span>
          <h1 className="mt-3 text-2xl text-ink">{item.name}</h1>
          <p className="mt-2 font-mono text-2xl text-brand">{formatWon(item.price)}원</p>
          <p className="mt-1 text-xs text-subtle">중량 {item.weight}</p>
          <p className="mt-4 text-sm leading-relaxed text-subtle">{item.description}</p>

          <div className="mt-6">
            <p className="text-xs text-subtle">수량</p>
            {picked && remain === 0 ? (
              <p className="mt-2 text-xs text-alert">이미 필요한 수량이 모두 모였습니다.</p>
            ) : (
              <>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={!picked}
                    className="h-9 w-9 rounded-lg border border-hairline bg-white text-ink disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="font-mono text-base text-ink">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(remain, q + 1))}
                    disabled={!picked || qty >= remain}
                    className="h-9 w-9 rounded-lg border border-hairline bg-white text-ink disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                {picked && (
                  <p className="mt-1.5 text-[11px] text-subtle">최대 {remain}개까지 후원 가능</p>
                )}
              </>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xs text-subtle">이 물품이 필요한 기관 · 가까운 순</p>
            <div className="mt-2 flex flex-col gap-2">
              {reqs.map((r) => {
                const on = r.orgId === orgId;
                const rRemain = Math.max(0, r.neededQty - r.receivedQty - r.pendingQty);
                return (
                  <button
                    key={r.id}
                    onClick={() => setOrgId(r.orgId)}
                    className={`rounded-lg bg-white p-3 text-left transition ${
                      on ? 'border-2 border-brand' : 'border border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-ink">{r.org.name}</p>
                        {r.urgentQty > 0 && (
                          <span className="rounded-full bg-alert px-2 py-0.5 text-[11px] text-white">긴급</span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-subtle">{r.org.distanceKm}km</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar percent={r.percent} complete={r.percent >= 100} />
                    </div>
                    {r.pendingQty > 0 && (
                      <p className="mt-1 text-[11px] text-subtle">수락 대기 {r.pendingQty}개</p>
                    )}
                    <p className="mt-1.5 text-xs text-subtle">
                      총 필요 {r.neededQty}개{r.urgentQty > 0 && ` (긴급 ${r.urgentQty}개)`} · 현재 {r.receivedQty}개 ({r.percent}%)
                      {rRemain === 0 && <span className="ml-1 text-brand">· 모집 완료</span>}
                    </p>
                    {r.urgentQty > 0 && r.urgentReason && (
                      <p className="mt-1 text-[11px] text-alert">{r.urgentReason}</p>
                    )}
                  </button>
                );
              })}

              {reqs.length === 0 && (
                <p className="rounded-lg border border-hairline bg-white p-4 text-sm text-subtle">
                  현재 이 물품을 요청한 기관이 없습니다.
                </p>
              )}
            </div>
          </div>

          <label className="mt-6 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={revealDonor}
              onChange={(e) => setRevealDonor(e.target.checked)}
              className="h-4 w-4 rounded border-hairline"
            />
            후원자명을 공개합니다
          </label>
          <p className="mt-1 text-[11px] text-subtle">
            체크 해제 시 후원 인증에 "익명의 후원자"로 표시됩니다
          </p>

          <div className="mt-4 flex gap-2.5">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <button
                onClick={handleAddToCart}
                disabled={!picked || remain === 0}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand py-3.5 text-sm text-brand disabled:opacity-40"
              >
                <ShoppingCart size={15} /> 장바구니 담기
              </button>
              {added && (
                <p className="flex items-center gap-1 text-[11px] text-brand">
                  <Check size={11} /> 장바구니에 담았습니다
                </p>
              )}
            </div>
            <button
              onClick={handleDonate}
              disabled={!picked || done || remain === 0}
              className="flex-1 rounded-lg bg-brand py-3.5 text-sm text-white disabled:opacity-40"
            >
              {formatWon(item.price * qty)}원 바로 후원
            </button>
          </div>
          <p className="mt-2.5 text-center text-xs text-subtle">
            결제 후 {picked?.org.name ?? '기관'}이 수락하면 배송이 시작됩니다
          </p>
        </div>
      </div>
    </div>
  );
}