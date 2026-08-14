import { Camera } from 'lucide-react';
import { getItemById } from '../data/items';

export default function ProofCard({ proof, onPublish }) {
  const item = getItemById(proof.itemId);
  const donorLabel = proof.anonymous ? '익명의 후원자' : proof.donor;

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-white">
      <div className="flex h-32 items-center justify-center bg-hairline">
        {proof.imageUrl ? (
          <img src={proof.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <Camera size={24} className="text-subtle" />
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-ink">{item.name} × {proof.qty}</p>
        <p className="mt-1 text-xs text-subtle">{donorLabel} · {proof.date}</p>

        {proof.published ? (
          <>
            <span className="mt-3 inline-block rounded-full bg-brand-soft px-2.5 py-1 text-xs text-brand">
              공개됨
            </span>
            <p className="mt-2 text-xs leading-relaxed text-subtle">{proof.message}</p>
          </>
        ) : (
          <button
            onClick={() => onPublish(proof.id)}
            className="mt-3 w-full rounded-lg bg-brand py-2 text-xs text-white"
          >
            인증 사진 공개하기
          </button>
        )}
      </div>
    </div>
  );
}
