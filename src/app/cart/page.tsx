'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart } = useCart(); // Dito natin kukunin ang listahan ng items mula sa Context

  // Compute total price
  const totalPrice = cart.reduce((acc: any, item: any) => acc + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#f7f4eb] text-[#3a352a]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl font-bold mb-10 uppercase tracking-widest border-b border-[#c2b9a7]/30 pb-4">
          Your Order
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-xl border border-dashed border-[#c2b9a7]">
            <p className="text-[#596643] mb-6 text-lg">Your cart is currently empty.</p>
            <Link 
              href="/menu" 
              className="px-8 py-3 bg-[#596643] text-[#e0d7c5] font-bold uppercase tracking-widest rounded hover:bg-[#8b3a2b] transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items List */}
            {cart.map((item: any, index: number) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-[#c2b9a7]/30"
                >
                <div className="flex items-center gap-6">
                    <img 
                    src={item.image_url || '/logo.jpg'} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg" 
                    />
                    <div>
                    <h3 className="font-serif font-bold text-lg text-[#3a352a]">{item.name}</h3>
                    <p className="text-sm text-[#596643] italic">{item.category}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <p className="font-bold text-lg text-[#596643]">
                    ₱{(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    
                    {/* ITO ANG BAGONG BUTTON */}
                    <button 
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 transition p-2"
                    aria-label="Remove item"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                </div>
            ))}

            {/* Checkout Section */}
            <div className="border-t border-[#c2b9a7] pt-8 mt-8 flex flex-col items-end gap-4">
              <div className="text-right">
                <p className="text-sm uppercase tracking-widest text-[#596643]">Total Amount</p>
                <p className="text-3xl font-bold text-[#3a352a]">
                  ₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button className="px-10 py-4 bg-[#8b3a2b] text-white font-bold uppercase tracking-widest rounded hover:bg-[#596643] transition-all duration-300 shadow-lg">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}