import { Heart, ShoppingBag } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="flex items-center gap-2 mb-4 text-pink-500">
        <Heart className="w-10 h-10 fill-current animate-pulse" />
        <ShoppingBag className="w-10 h-10 text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-2">
        라이키(Likey) 세팅 완료! 🚀
      </h1>
      <p className="text-slate-400 text-center">
        Tailwind CSS v4 + React Router + Lucide Icons 적용됨
      </p>
    </div>
  );
}