import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DevNav from './components/DevNav';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthSelectPage from './pages/AuthSelectPage';
import LoginPage from './pages/LoginPage';
import MarketPage from './pages/MarketPage';
import DetailPage from './pages/DetailPage';
import CartPage from './pages/CartPage';
import FeedPage from './pages/FeedPage';
import OrgPage from './pages/OrgPage';

function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthSelectPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/items/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/org" element={<OrgPage />} />
        <Route path="*" element={<div className="p-8">페이지를 찾을 수 없습니다</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;