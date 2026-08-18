import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadState, saveState } from '../lib/storage';
import { useDonation } from './DonationContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { getRequestsByItem } = useDonation();
  const [cartItems, setCartItems] = useState(() => loadState('nanumcart:cart', []));

  useEffect(() => saveState('nanumcart:cart', cartItems), [cartItems]);

  // 이 (물품, 기관) 조합에 담을 수 있는 최대 수량. 장바구니에 이미 담긴 수량은
  // 아직 결제 전이라 pendingQty에 반영되지 않으므로 별도로 빼지 않는다.
  const remainFor = (itemId, orgId) => {
    const request = getRequestsByItem(itemId).find((r) => r.orgId === orgId);
    if (!request) return 0;
    return Math.max(0, request.neededQty - request.receivedQty - request.pendingQty);
  };

  /** 같은 물품 + 같은 기관 조합이면 수량만 합친다 */
  const addToCart = ({ itemId, orgId, qty }) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.itemId === itemId && c.orgId === orgId);
      const cap = Math.max(1, remainFor(itemId, orgId));
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id ? { ...c, qty: Math.min(c.qty + qty, cap) } : c
        );
      }
      const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return [...prev, { id, itemId, orgId, qty: Math.min(Math.max(1, qty), cap) }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((c) => c.id !== id));

  const setQty = (id, qty) =>
    setCartItems((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const cap = Math.max(1, remainFor(c.itemId, c.orgId));
        return { ...c, qty: Math.min(Math.max(1, qty), cap) };
      })
    );

  const clearCart = () => setCartItems([]);

  const value = useMemo(
    () => ({ cartItems, addToCart, removeFromCart, setQty, clearCart, remainFor }),
    [cartItems, getRequestsByItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart는 CartProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
