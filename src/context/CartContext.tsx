import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, options?: { size?: string; quantity?: number }) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  updateSize: (cartKey: string, size: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart) as Partial<CartItem>[];
      setItems(parsed.map((item) => {
        const size = item.size || 'Standard';
        return {
          ...(item as CartItem),
          size,
          cartKey: item.cartKey || `${item.id}_${size}`,
          quantity: item.quantity || 1,
        };
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, options: { size?: string; quantity?: number } = {}) => {
    const size = options.size || 'Standard';
    const quantity = Math.max(1, options.quantity || 1);
    const cartKey = `${product.id}_${size}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity, size, cartKey }];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
    );
  };

  const updateSize = (cartKey: string, size: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.cartKey === cartKey);
      if (!item) return prev;

      const nextKey = `${item.id}_${size}`;
      const duplicate = prev.find((i) => i.cartKey === nextKey);
      if (duplicate) {
        return prev
          .filter((i) => i.cartKey !== cartKey)
          .map((i) => i.cartKey === nextKey ? { ...i, quantity: i.quantity + item.quantity } : i);
      }

      return prev.map((i) => i.cartKey === cartKey ? { ...i, size, cartKey: nextKey } : i);
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, updateSize, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
