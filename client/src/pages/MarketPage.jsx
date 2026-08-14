import { useMemo, useState } from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import UrgentBanner from '../components/UrgentBanner';
import ItemCard from '../components/ItemCard';
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

  const urgent = useMemo(() => {
    const urgentItemIds = new Set(
      requests.filter((r) => r.status === 'open' && r.isUrgent).map((r) => r.itemId)
    );

    const manual = items
      .filter((item) => urgentItemIds.has(item.id))
      .map((item) => {
        const itemRequests = getRequestsByItem(item.id);
        const urgentReason = itemRequests.find((r) => r.isUrgent)?.urgentReason ?? null;
        return { item, percent: progressOfAll(itemRequests), urgentReason };
      });

    const auto = items
      .filter((item) => !urgentItemIds.has(item.id))
      .map((item) => ({ item, percent: progressOfAll(getRequestsByItem(item.id)) }))
      .filter((r) => r.percent < 40);

    return [...manual, ...auto].slice(0, 4);
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

      <div className="px-6 py-5">
        <CategoryNav selected={category} onSelect={setCategory} />

        <div className="mt-5">
          <UrgentBanner items={urgent} />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-4">
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