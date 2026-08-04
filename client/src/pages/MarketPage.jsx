import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import UrgentBanner from '../components/UrgentBanner';
import ItemCard from '../components/ItemCard';
import { progressOfAll } from '../utils/urgency';

export default function MarketPage() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  // API 데이터 상태
  const [items, setItems] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 백엔드 API에서 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, orgsRes, reqsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/items'),
          axios.get('http://localhost:5000/api/organizations'),
          axios.get('http://localhost:5000/api/requests'),
        ]);

        if (itemsRes.data.success) setItems(itemsRes.data.data);
        if (orgsRes.data.success) setOrganizations(orgsRes.data.data);
        if (reqsRes.data.success) setRequests(reqsRes.data.data);
      } catch (error) {
        console.error('API 데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 특정 물품 ID에 해당하는 요청 목록 필터링 헬퍼
  const getRequestsByItem = (itemId) => requests.filter((r) => r.itemId === itemId);

  const needCount = requests
    .filter((r) => r.status === 'open')
    .reduce((sum, r) => sum + (r.neededQty - r.receivedQty), 0);

  const visible = useMemo(
    () =>
      items
        .filter((i) => (category === 'all' ? true : i.category === category))
        .filter((i) => (query ? i.name.includes(query) : true)),
    [items, category, query]
  );

  const urgent = useMemo(
    () =>
      items
        .map((item) => ({ item, percent: progressOfAll(getRequestsByItem(item.id)) }))
        .filter((r) => r.percent < 40)
        .slice(0, 4),
    [items, requests]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-subtle text-sm">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

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
    </div>
  );
}