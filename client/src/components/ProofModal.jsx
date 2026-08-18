import { useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { getItemById } from '../data/items';
import { getOrganizationById } from '../data/organizations';

/** 후원 인증 사진을 확대해서 보여주는 모달. DetailPage·FeedPage가 공유한다. */
export default function ProofModal({ proof, onClose }) {
  useEffect(() => {
    if (!proof) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [proof, onClose]);

  if (!proof) return null;

  const item = getItemById(proof.itemId);
  const org = getOrganizationById(proof.orgId);
  const donorLabel = proof.anonymous ? '익명의 후원자' : proof.donor;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center bg-gray-100">
          {proof.imageUrl ? (
            <img
              src={proof.imageUrl}
              alt={item.name}
              className="max-h-[60vh] w-full object-contain"
            />
          ) : (
            <Camera size={32} className="my-20 text-subtle" />
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <p className="text-sm text-ink">{org.name}</p>
          <p className="mt-1 text-sm text-subtle">{item.name} × {proof.qty}</p>
          <p className="mt-1 text-xs text-subtle">{donorLabel} · {proof.date}</p>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink">{proof.message}</p>
        </div>
      </div>
    </div>
  );
}
