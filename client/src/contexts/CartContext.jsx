import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /** 같은 물품 + 같은 기관 조합이면 수량만 합친다 */
  const addToCart = ({ itemId, orgId, qty }) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.itemId === itemId && c.orgId === orgId);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { id: `cart-${Date.now()}`, itemId, orgId, qty }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((c) => c.id !== id));

  const setQty = (id, qty) =>
    setCartItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c))
    );

  const clearCart = () => setCartItems([]);

  const value = useMemo(
    () => ({ cartItems, addToCart, removeFromCart, setQty, clearCart }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart는 CartProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
