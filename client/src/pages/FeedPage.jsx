import { useState } from 'react';
import { Camera } from 'lucide-react';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import CategoryBarChart from '../components/CategoryBarChart';
import { organizations, getOrganizationById } from '../data/organizations';
import { items, getItemById } from '../data/items';
import { useDonation } from '../contexts/DonationContext';
import { categoryBreakdown } from '../utils/orgAnalytics';

// 결제 시 donor에 고정으로 찍히는 값(DetailPage·CartPage 공통) — 실제 로그인 계정이
// 없는 대신, "이 세션에서 내가 한 후원"을 가려내는 임시 식별자로 쓴다.
const MY_DONOR_LABEL = '나 (테스트 후원자)';

export default function FeedPage() {
  const [query, setQuery] = useState('');
  const { donations, getPublishedProofs, totalAmount } = useDonation();
  const proofs = getPublishedProofs();

  const myDonations = donations.filter((d) => d.donor === MY_DONOR_LABEL);
  const myCategoryData = categoryBreakdown(myDonations, items);
  const myOrgCount = new Set(myDonations.map((d) => d.orgId)).size;
  const myItemTypeCount = new Set(myDonations.map((d) => d.itemId)).size;

  return (
    <div className="min-h-screen bg-cream">
      <Header query={query} onQueryChange={setQuery} orgCount={organizations.length} />

      {myDonations.length > 0 && (
        <div className="px-6 pt-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-lg text-ink">내 후원 활동</h2>
            <p className="mt-1.5 text-sm text-subtle">지금까지 내가 후원한 내역을 모아봤어요.</p>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <MetricCard value={myDonations.length} unit="건" label="총 후원 건수" />
              <MetricCard value={myOrgCount} unit="개" label="도운 기관 수" accent />
              <MetricCard value={myItemTypeCount} unit="종" label="후원한 물품 종류" />
              <MetricCard value={`₩${Math.round(totalAmount(myDonations) / 1000)}`} unit="K" label="총 후원액" />
            </div>

            <div className="mt-4">
              <CategoryBarChart data={myCategoryData} />
            </div>
          </div>
        </div>
      )}

      <div className={`px-6 py-10 ${myDonations.length > 0 ? 'mt-6 border-t border-hairline' : ''}`}>
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
