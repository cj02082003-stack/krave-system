'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // 1. Load cart mula sa localStorage pag-mount ng app
  useEffect(() => {
    const savedCart = localStorage.getItem('krave-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. I-save sa localStorage tuwing nagbabago ang cart
  useEffect(() => {
    localStorage.setItem('krave-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#596643', color: '#fff' },
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    toast('Item removed', {
      icon: '🗑️',
      style: { background: '#8b3a2b', color: '#fff' },
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);