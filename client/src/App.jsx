import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DevNav from './components/DevNav';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { DonationProvider } from './contexts/DonationContext';
import { CartProvider } from './contexts/CartContext';

import HomePage from './pages/HomePage';
import AuthSelectPage from './pages/AuthSelectPage';
import LoginPage from './pages/LoginPage';
import MarketPage from './pages/MarketPage';
import DetailPage from './pages/DetailPage';
import CartPage from './pages/CartPage';
import FeedPage from './pages/FeedPage';
import OrgPage from './pages/OrgPage';
import OrgDetailPage from './pages/OrgDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DonationProvider>
          <CartProvider>
            {import.meta.env.DEV && <DevNav />}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthSelectPage />} />
              <Route path="/login/:role" element={<LoginPage />} />
              <Route
                path="/market"
                element={
                  <ProtectedRoute allow={['user', 'guest']}>
                    <MarketPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/:id"
                element={
                  <ProtectedRoute allow={['user', 'guest']}>
                    <DetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute allow={['user', 'guest']}>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/feed" element={<FeedPage />} />
              <Route
                path="/orgs/:orgId"
                element={
                  <ProtectedRoute allow={['user', 'guest']}>
                    <OrgDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/org"
                element={
                  <ProtectedRoute allow={['org']}>
                    <OrgPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<div className="p-8">페이지를 찾을 수 없습니다</div>} />
            </Routes>
          </CartProvider>
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
