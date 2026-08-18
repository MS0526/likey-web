import { useMemo, useState } from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import UrgentBanner from '../components/UrgentBanner';
import ItemCard from '../components/ItemCard';
import OrgCard from '../components/OrgCard';
import AiChatbot from '../components/AiChatbot';
import { items } from '../data/items';
import { organizations } from '../data/organizations';
import { useDonation } from '../contexts/DonationContext';
import { progressOfAll } from '../utils/urgency';

export default function MarketPage() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const { requests, getRequestsByItem } = useDonation();

  const needCount = requests
    .filter((r) => r.status === 'open')
    .reduce((sum, r) => sum + Math.max(0, r.neededQty - r.receivedQty), 0);

  const visible = useMemo(
    () =>
      items
        .filter((i) => (category === 'all' ? true : i.category === category))
        .filter((i) => (query ? i.name.includes(query) : true)),
    [category, query]
  );

  const matchingOrgs = useMemo(
    () => (query ? organizations.filter((o) => o.name.includes(query)) : []),
    [query]
  );

  const urgent = useMemo(() => {
    const urgentItemIds = new Set(
      requests.filter((r) => r.status === 'open' && r.urgentQty > 0).map((r) => r.itemId)
    );

    const manual = items
      .filter((item) => urgentItemIds.has(item.id))
      .map((item) => {
        const itemRequests = getRequestsByItem(item.id);
        const urgentReq = itemRequests.find((r) => r.urgentQty > 0) ?? null;
        return {
          item,
          percent: progressOfAll(itemRequests),
          urgentReason: urgentReq?.urgentReason ?? null,
          neededQty: urgentReq?.neededQty ?? null,
          urgentQty: urgentReq?.urgentQty ?? 0,
        };
      });

    const auto = items
      .filter((item) => !urgentItemIds.has(item.id))
      .map((item) => ({ item, percent: progressOfAll(getRequestsByItem(item.id)) }))
      .filter((r) => r.percent < 40);

    return [...manual, ...auto];
  }, [requests]);

  return (
    <div className="min-h-screen bg-cream">
      <Header query={query} onQueryChange={setQuery} orgCount={organizations.length} />

      <div className="flex items-center justify-between bg-brand px-6 py-3.5">
        <p className="text-sm text-white">
          전국 <strong>{organizations.length}개의 기관</strong>이{' '}
          <strong>{needCount}개의 물품</strong>이 필요합니다!
        </p>
        <p className="text-xs text-white/70">기관이 수락한 후원만 배송됩니다</p>
      </div>

      <div className="px-6 py-5 pb-24">
        <CategoryNav selected={category} onSelect={setCategory} />

        <div className="mt-5">
          <UrgentBanner items={urgent} />
        </div>

        {matchingOrgs.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm text-ink">기관</h2>
            <div className="mt-3 grid gap-5 md:grid-cols-4">
              {matchingOrgs.map((org) => (
                <OrgCard key={org.id} organization={org} />
              ))}
            </div>
          </div>
        )}

        {query && (
          <h2 className="mt-6 text-sm text-ink">물품</h2>
        )}

        <div className="mt-3 grid gap-5 md:grid-cols-4">
          {visible.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-subtle">
            조건에 맞는 물품이 없습니다. 다른 카테고리를 선택해 보세요.
          </p>
        )}
      </div>

      <AiChatbot />
    </div>
  );
}