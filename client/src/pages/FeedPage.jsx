import { useState } from 'react';
import { Camera } from 'lucide-react';
import Header from '../components/Header';
import { organizations, getOrganizationById } from '../data/organizations';
import { getItemById } from '../data/items';
import { useDonation } from '../contexts/DonationContext';

export default function FeedPage() {
  const [query, setQuery] = useState('');
  const { getPublishedProofs } = useDonation();
  const proofs = getPublishedProofs();

  return (
    <div className="min-h-screen bg-cream">
      <Header query={query} onQueryChange={setQuery} orgCount={organizations.length} />

      <div className="px-6 py-10">
        <h1 className="text-center text-2xl text-ink">후원 인증</h1>

        {proofs.length === 0 ? (
          <div className="mt-16 text-center">
            <Camera size={28} className="mx-auto text-subtle" />
            <p className="mt-3 text-sm text-subtle">아직 공개된 인증이 없습니다</p>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {proofs.map((proof) => {
              const org = getOrganizationById(proof.orgId);
              const item = getItemById(proof.itemId);
              const donorLabel = proof.anonymous ? '익명의 후원자' : proof.donor;

              return (
                <div key={proof.id} className="overflow-hidden rounded-xl border border-hairline bg-white">
                  <div className="flex h-40 items-center justify-center bg-brand-soft">
                    {proof.imageUrl ? (
                      <img
                        src={proof.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera size={30} className="text-brand opacity-40" />
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-subtle">{org.name}</p>
                    <p className="mt-1 text-sm text-ink">{item.name} × {proof.qty}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{proof.message}</p>
                    <p className="mt-3 text-xs text-subtle">{donorLabel} · {proof.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
