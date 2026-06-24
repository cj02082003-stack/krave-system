'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  status: string;
  image_url: string | null;
  created_at: string;
  category_id: string | null;
  menu_heading: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priority: number | null;
  status: string | null;
  created_at: string;
}

export default function MenuPage() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Ref para sa control ng horizontal container scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [catResponse, prodResponse] = await Promise.all([
          supabase
            .from('categories')
            .select('*')
            .eq('status', 'ACTIVE')
            .order('priority', { ascending: true }),
          
          supabase
            .from('products')
            .select('*')
            .eq('status', 'IN STOCK')
        ]);

        if (catResponse.error) throw new Error(`Categories Error: ${catResponse.error.message}`);
        if (prodResponse.error) throw new Error(`Products Error: ${prodResponse.error.message}`);

        if (catResponse.data) setCategories(catResponse.data);
        if (prodResponse.data) setProducts(prodResponse.data);

      } catch (error: any) {
        console.error("Critical error inside fetchMenuData hook:", error);
        setErrorMessage(error.message || "Failed to establish a valid database handshake.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenuData();
  }, []);

  // Handler para sa Desktop arrow button clicks
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Distansya ng galaw kada click
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => String(p.category_id).trim() === String(activeCategory).trim());

  return (
    <div className="min-h-screen bg-[#f7f4eb] text-[#3a352a]">
      {/* <Header cartCount={cartCount} /> */}
      <Header />
      
      {/* Hero Banner */}
      <section className="relative bg-[#3a352a] text-[#e0d7c5] py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/menu-bg-pattern.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-[#c2b9a7]">Culinary Experience</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide uppercase">Our Kitchen Menu</h1>
          <p className="font-sans text-sm sm:text-base text-[#c2b9a7] max-w-xl mx-auto font-light leading-relaxed">
            Savor the rich, authentic, and modern twists of flavors curated carefully by our chefs.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg text-sm text-center">
            <span className="font-bold">Database Communication Warning:</span> {errorMessage}
          </div>
        )}

        {/* UPGRADED CATEGORY TABS SECTION WITH ARROWS & TRANSPARENT SCROLL */}
        <div className="relative max-w-4xl mx-auto mb-12 border-b border-[#c2b9a7]/30 pb-4 flex items-center group">
          
          {/* Left Arrow - Desktop View Only */}
          <button 
            onClick={() => handleScroll('left')}
            className="hidden lg:flex absolute left-0 z-10 items-center justify-center w-8 h-8 rounded-full bg-[#3a352a] text-[#e0d7c5] shadow-md hover:bg-[#8b3a2b] transition-all -ml-4 opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Scroll Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Tabs View Wrapper with Transparent Scrollbar */}
          <div 
            ref={scrollContainerRef}
            className="w-full flex items-center overflow-x-auto gap-2 px-2 scrollbar-none style-scrollbar-trans"
            style={{ 
              scrollbarWidth: 'none', /* Firefox fallback */
              msOverflowStyle: 'none' /* IE/Edge fallback */
            }}
          >
            {/* All Flavors Base Button */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded transition-all duration-300 flex-shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#596643] text-[#e0d7c5] shadow-md'
                  : 'bg-transparent text-[#596643] hover:bg-[#596643]/10'
              }`}
            >
              All Flavors
            </button>
            
            {/* Dynamic Map Categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded transition-all duration-300 flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#596643] text-[#e0d7c5] shadow-md'
                    : 'bg-transparent text-[#596643] hover:bg-[#596643]/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Arrow - Desktop View Only */}
          <button 
            onClick={() => handleScroll('right')}
            className="hidden lg:flex absolute right-0 z-10 items-center justify-center w-8 h-8 rounded-full bg-[#3a352a] text-[#e0d7c5] shadow-md hover:bg-[#8b3a2b] transition-all -mr-4 opacity-0 group-hover:opacity-100 focus:outline-none"
            aria-label="Scroll Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Global Embedded CSS Style Tag para itago ang scrollbar track lines sa Chrome/Safari */}
        <style jsx global>{`
          .style-scrollbar-trans::-webkit-scrollbar {
            display: none;
            width: 0 !important;
            height: 0 !important;
            background: transparent;
          }
        `}</style>

        {/* Products Display Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-[#e0d7c5]/20 border border-[#c2b9a7]/20 h-96 rounded-xl animate-pulse flex flex-col justify-between p-6">
                <div className="w-full bg-[#c2b9a7]/40 h-48 rounded-lg"></div>
                <div className="h-6 bg-[#c2b9a7]/40 rounded w-3/4 my-4"></div>
                <div className="h-4 bg-[#c2b9a7]/30 rounded w-full mb-2"></div>
                <div className="h-10 bg-[#596643]/20 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-[#e0d7c5]/30 rounded-xl overflow-hidden border border-[#c2b9a7]/40 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col group"
                >
                  <div className="h-56 w-full overflow-hidden bg-[#c2b9a7]/40 relative flex items-center justify-center">
                    <img 
                      src={product.image_url && product.image_url.trim() !== '' ? product.image_url : '/logo.jpg'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/logo.jpg';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-[#3a352a] text-[#e0d7c5] px-3 py-1 rounded text-xs font-serif font-bold tracking-wider shadow-md">
                      ₱{(product.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between space-y-5">
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#3a352a] group-hover:text-[#8b3a2b] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#596643] font-light leading-relaxed line-clamp-3">
                        {product.description || "No specific recipe description available for this kitchen selection item."}
                      </p>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full py-3 text-xs font-bold tracking-widest uppercase text-[#e0d7c5] bg-[#596643] rounded hover:bg-[#8b3a2b] transition-colors duration-300 shadow-sm focus:outline-none"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-[#c2b9a7]/40 rounded-xl bg-white/50">
                <svg className="w-12 h-12 text-[#8b3a2b]/60 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-[#8b3a2b] font-medium text-sm tracking-wide">No items found matching this specific active category tab.</p>
              </div>
            )}
          </div>
        )}
      </main>
        <div id="visit">
            <Footer />
        </div>
    </div>
  );
}