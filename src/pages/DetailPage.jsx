// src/pages/DetailPage.jsx
import { useParams } from 'react-router-dom';

export default function DetailPage() {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">물품 상세</h1>
      <p className="mt-2 text-gray-500">물품 ID: {id}</p>
    </div>
  );
}