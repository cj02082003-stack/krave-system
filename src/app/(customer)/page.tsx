'use client';

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { User } from "@supabase/supabase-js";
import Header from '../components/Header';
import Footer from '../components/Footer';  

// Helper component for the TikTok-style jump and zip animation
const FlyingImage = ({ id, startX, startY, endX, endY, img, onComplete }: any) => {
  const [phase, setPhase] = useState('start');
  const finalImg = (img && img.trim() !== '') ? img : '/logo.jpg';

  useEffect(() => {
    const popTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('pop');
      });
    });

    const flyTimer = setTimeout(() => {
      setPhase('fly');
    }, 250);

    const doneTimer = setTimeout(() => {
      onComplete(id);
    }, 750);

    return () => {
      cancelAnimationFrame(popTimer);
      clearTimeout(flyTimer);
      clearTimeout(doneTimer);
    };
  }, [id, onComplete]);

  let style: React.CSSProperties = {
    left: startX,
    top: startY,
    transform: 'translate(-50%, -50%) scale(0)',
    opacity: 1,
    transition: 'none'
  };

  if (phase === 'pop') {
    style = {
      left: startX,
      top: startY - 80,
      transform: 'translate(-50%, -50%) scale(1.15)',
      opacity: 1,
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
  } else if (phase === 'fly') {
    style = {
      left: endX,
      top: endY,
      transform: 'translate(-50%, -50%) scale(0.1)',
      opacity: 0.2,
      transition: 'all 0.5s cubic-bezier(0.5, 0, 0.2, 1)'
    };
  }

  return (
    <img
      src={finalImg}
      onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
      className="fixed z-[150] w-20 h-20 rounded-2xl object-cover border-2 border-[#8b3a2b] shadow-2xl pointer-events-none"
      style={style}
      alt="flying-product"
    />
  );
};

export default function LandingPage() {
  const router = useRouter();
  
  // Dynamic States for Supabase Data
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Items']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // UI States
  const [showMobileTray, setShowMobileTray] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Cart States
  const [cart, setCart] = useState<any[]>([]);
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  const [flyingItems, setFlyingItems] = useState<any[]>([]);
  const [bumpTray, setBumpTray] = useState(false);

  const getProductImage = (imgUrl: string | null | undefined) => {
    if (!imgUrl || imgUrl.trim() === '') return '/logo.jpg';
    return imgUrl;
  };

  // Fetch Products and Categories from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const { data: dbProducts, error: prodError } = await supabase
          .from('products')
          .select('*, categories(name)');

        const { data: dbCategories, error: catError } = await supabase
          .from('categories')
          .select('name')
          .eq('status', 'ACTIVE');

        if (prodError || catError) {
          console.warn("Using fallback data due to fetch issue.");
          loadFallbackData();
        } else if (dbProducts && dbProducts.length > 0) {
          const formattedProducts = dbProducts.map(p => {
            const rawImg = p.image_url || p.img;
            return {
              id: p.id,
              name: p.name,
              cat: p.categories?.name || p.category || 'Other',
              menuHeading: p.menu_heading || null,
              price: p.price ? parseFloat(p.price).toFixed(2) : '0.00',
              rating: p.rating || '4.8',
              reviews: p.reviews || Math.floor(Math.random() * 120) + 10,
              img: getProductImage(rawImg),
              badge: p.badge || null,
              desc: p.description || '',
              status: p.status
            };
          });
          setProducts(formattedProducts);

          if (dbCategories && dbCategories.length > 0) {
            setCategories(['All Items', ...dbCategories.map(c => c.name)]);
          } else {
            const uniqueCats = Array.from(new Set(formattedProducts.map(p => p.cat))) as string[];
            setCategories(['All Items', ...uniqueCats]);
          }
        } else {
          loadFallbackData();
        }
      } catch (err) {
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    }

    function loadFallbackData() {
      const fallback = [
        { id: '1', name: 'Kare Kare Bagnet', cat: "Chef's Specials", menuHeading: null, price: '380.00', rating: '4.9', reviews: '320', img: '/assets/menu/kare-kare.png', badge: 'Must Try', desc: 'Traditional rich, savory peanut sauce served with crispy deep-fried pork belly instead of usual oxtail.', status: 'IN STOCK' },
        { id: '2', name: 'Mongo Bagnet', cat: "Chef's Specials", menuHeading: null, price: '290.00', rating: '4.8', reviews: '150', img: '/assets/menu/mongo-bagnet.png', desc: 'Hearty mung bean stew cooked with garlic, onions, tomatoes, topped with crispy bagnet.', status: 'IN STOCK' },
        { id: '3', name: 'Grilled Pork Belly', cat: "Chef's Specials", menuHeading: null, price: '310.00', rating: '4.9', reviews: '245', img: '/assets/menu/pork-belly.png', badge: 'New', desc: 'Perfectly charred and marinated grilled pork belly served with our signature vinegar dip.', status: 'IN STOCK' },
        { id: '4', name: 'Traditional Beef Pho', cat: 'Vietnamese Classics', menuHeading: 'Soups', price: '320.00', rating: '4.8', reviews: '210', img: '/assets/menu/pho-bo.png', desc: 'Tender slices of quality beef presented in a flavorful broth with rice noodles and fresh herbs.', status: 'IN STOCK' },
        { id: '5', name: 'Traditional Chicken Pho', cat: 'Vietnamese Classics', menuHeading: 'Soups', price: '295.00', rating: '4.7', reviews: '185', img: '', desc: 'Delicate and comforting chicken broth infused with aromatic spices, flat rice noodles, and shredded chicken.', status: 'IN STOCK' },
        { id: '6', name: 'Tropical Vietnamese Salmon', cat: 'Vietnamese Classics', menuHeading: 'Salads', price: '360.00', rating: '4.9', reviews: '98', img: null, badge: 'Healthy Choice', desc: 'Pan-seared fresh salmon chunks resting on a bed of crispy Asian greens, shredded mangoes, and sweet lime sauce.', status: 'IN STOCK' },
        { id: '7', name: 'Gỏi Cuốn (Spring Rolls)', cat: 'Vietnamese Classics', menuHeading: 'Appetizers', price: '220.00', rating: '4.9', reviews: '400', img: '/assets/menu/spring-rolls.png', badge: 'Bestseller', desc: 'Fresh rice paper rolls filled with shrimp, pork, vermicelli, and herbs.', status: 'IN STOCK' },
        { id: '8', name: 'Hakaw', cat: 'Handcrafted Dimsum', menuHeading: null, price: '250.00', rating: '4.7', reviews: '115', img: '/assets/menu/hakaw.jpg', desc: 'Delicate shrimp dumplings wrapped in translucent wonton skin.', status: 'IN STOCK' },
      ];
      
      const processedFallback = fallback.map(item => ({
        ...item,
        img: getProductImage(item.img)
      }));

      setProducts(processedFallback);
      setCategories(['All Items', "Chef's Specials", 'Vietnamese Classics', 'Handcrafted Dimsum']);
    }

    fetchData();
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      setUser(data.session.user);
      const welcomed = localStorage.getItem("krave-welcomed");
      if (!welcomed) {
        setShowWelcome(true);
        localStorage.setItem("krave-welcomed", "true");
        setTimeout(() => setShowWelcome(false), 3000);
      }
    } else {
      const walkthroughDone = localStorage.getItem("krave-walkthrough");
      if (!walkthroughDone) setShowWalkthrough(true);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("krave-welcomed");
    router.push("/auth/login");
  }

  // Cart Handlers
  const updateLocalQty = (itemId: string, delta: number) => {
    setLocalQuantities(prev => {
      const currentQty = prev[itemId] || 1;
      return { ...prev, [itemId]: Math.max(1, currentQty + delta) };
    });
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // FIXED & CLEANED ADD TO CART FUNCTION
  const addToCart = (item: any) => {
    const qtyToAdd = localQuantities[item.id] || 1;
    
    let priceNum = 0;
    if (typeof item.price === 'string') {
      priceNum = parseFloat(item.price.replace(/[^0-9.-]/g, '')) || 0;
    } else if (typeof item.price === 'number') {
      priceNum = item.price;
    }

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (existingIdx >= 0) {
        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          qty: updated[existingIdx].qty + qtyToAdd,
          price: priceNum
        };
        return updated;
      } else {
        return [...prevCart, { ...item, qty: qtyToAdd, price: priceNum }];
      }
    });
    setLocalQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const handleAddToCartClick = (e: React.MouseEvent, item: any) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const isMobile = window.innerWidth < 1024;
    let endX = window.innerWidth / 2;
    let endY = 0;

    if (isMobile) {
      const mobileTray = document.getElementById('mobile-tray-btn');
      if (mobileTray) {
        const rect = mobileTray.getBoundingClientRect();
        endX = rect.left + 40;
        endY = rect.top + rect.height / 2;
      }
    } else {
      const sidebarTray = document.getElementById('desktop-tray-header');
      if (sidebarTray) {
        const rect = sidebarTray.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
      }
    }

    const id = Date.now() + Math.random().toString();
    setFlyingItems(prev => [...prev, { id, startX, startY, endX, endY, img: item.img }]);
    addToCart(item);
  };

  const removeFlyingItem = (id: string) => {
    setFlyingItems(prev => prev.filter(item => item.id !== id));
    setBumpTray(true);
    setTimeout(() => setBumpTray(false), 200);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      alert("🎉 Thank you for your order! Proceeding to preparation.");
      setCart([]);
    }, 2000);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = cart.length > 0 ? 49 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  // Filters logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Items' || product.cat === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category: string) => {
    if (category === 'All Items') return products.length;
    return products.filter(p => p.cat === category).length;
  };

  const uniqueFilteredCategories = Array.from(new Set(filteredProducts.map(p => p.cat)));

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#3a352a] font-sans antialiased selection:bg-[#596643]/20">
      
      {/* Animations Overlay */}
      {flyingItems.map(item => (
        <FlyingImage key={item.id} {...item} onComplete={removeFlyingItem} />
      ))}

      <Header 
        bumpCartIcon={bumpTray} 
        user={user} 
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        
        {/* Banner Section */}
        <section className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-[#3a352a] text-[#e0d7c5] shadow-2xl border border-white/5">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e0d7c5_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 bg-[#8b3a2b] text-white font-bold text-xs tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Open for Delivery
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
                Premium Asian Craving, <br />
                <span className="text-[#c2b9a7] italic font-light">Delivered Fresh.</span>
              </h1>
              <p className="text-[#c2b9a7] text-base mb-8 max-w-sm font-light">
                Indulge in our carefully handcrafted Filipino-Vietnamese masterworks.
              </p>
              
              {/* Search Bar */}
              <div className="flex bg-white rounded-2xl p-1.5 shadow-xl w-full max-w-md items-center">
                <span className="pl-3 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you craving for today?" 
                  className="bg-transparent text-[#3a352a] placeholder-gray-400 px-3 py-2 outline-none w-full text-sm font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="pr-2 text-xs text-gray-400 hover:text-gray-600">✕</button>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square max-w-[280px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="/logo.jpg" alt="Krave Kitchen Accent" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Dynamic Nav Tabs */}
        <section className="sticky top-16 z-30 bg-[#f7f4ed]/90 backdrop-blur-md py-4 mb-8 border-b border-gray-200 group/nav">
          <div className="max-w-7xl mx-auto relative px-1">
            
            <button 
              onClick={() => {
                const el = document.getElementById('category-scroll-container');
                if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white border border-gray-200 text-[#3a352a] rounded-full shadow-md items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/nav:opacity-100"
              aria-label="Scroll Left"
            >
              ⟨
            </button>

            <div 
              id="category-scroll-container"
              className="flex overflow-x-auto gap-3 pb-2 pt-1 px-2 lg:px-8 scroll-smooth select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((cat, idx) => {
                const isActive = selectedCategory === cat;
                return (
                  <button 
                    key={idx} 
                    onClick={() => {
                      setSelectedCategory(cat);
                      document.getElementById(`tab-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    id={`tab-${idx}`}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
                      isActive 
                        ? 'bg-[#596643] text-white shadow-md shadow-[#596643]/20 scale-[1.02]' 
                        : 'bg-white text-[#3a352a] hover:bg-gray-100 border border-gray-200 hover:scale-[1.01]'
                    }`}
                  >
                    {cat}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => {
                const el = document.getElementById('category-scroll-container');
                if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white border border-gray-200 text-[#3a352a] rounded-full shadow-md items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/nav:opacity-100"
              aria-label="Scroll Right"
            >
              ⟩
            </button>

          </div>
        </section>

        {/* Layout Partition */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Menu Catalog Grid */}
          <div className="w-full lg:w-[68%] xl:w-[72%]">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100">
                    <div className="bg-gray-200 h-48 rounded-t-3xl" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 rounded-xl mt-6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">No satisfying items found. Try another keyword!</p>
              </div>
            ) : (
              uniqueFilteredCategories.map(catGroup => {
                const categoryProducts = filteredProducts.filter(p => p.cat === catGroup);
                const uniqueMenuHeadings = Array.from(new Set(categoryProducts.map(p => p.menuHeading)));

                return (
                  <div key={catGroup} className="mb-14">
                    <h2 className="text-3xl font-serif font-bold mb-8 text-[#3a352a] border-l-4 border-[#596643] pl-4 tracking-tight">
                      {catGroup}
                    </h2>

                    {uniqueMenuHeadings.map((headingName, hIdx) => {
                      const finalHeadingProducts = categoryProducts.filter(p => p.menuHeading === headingName);
                      
                      return (
                        <div key={hIdx} className="mb-10 last:mb-0">
                          
                          {headingName ? (
                            <div className="flex items-center gap-4 mb-6 mt-2 select-none">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8b3a2b] animate-pulse"></span>
                                <h3 className="text-xs font-sans font-black uppercase tracking-[0.25em] text-[#8b3a2b] bg-[#8b3a2b]/5 border border-[#8b3a2b]/10 px-3.5 py-1.5 rounded-lg shadow-sm">
                                  {headingName} Selection
                                </h3>
                              </div>
                              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#8b3a2b]/20 via-[#8b3a2b]/5 to-transparent"></div>
                            </div>
                          ) : null}

                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {finalHeadingProducts.map(item => {
                              const isOutOfStock = item.status === 'OUT OF STOCK';
                              
                              return (
                                <div key={item.id} className={`bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group ${isOutOfStock ? 'opacity-50' : ''}`}>
                                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    {item.badge && (
                                      <span className="absolute top-3 left-3 bg-[#8b3a2b] text-white text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10 shadow-sm">
                                        {item.badge}
                                      </span>
                                    )}
                                    {isOutOfStock && (
                                      <span className="absolute top-3 right-3 bg-gray-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10 shadow-sm">
                                        Sold Out
                                      </span>
                                    )}
                                    <img 
                                      src={item.img} 
                                      alt={item.name} 
                                      onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                  </div>
                                  <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-[#8b3a2b] transition-colors mb-1">{item.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                      {item.cat} {item.menuHeading ? `• ${item.menuHeading}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-500 line-clamp-2 font-light mb-4 leading-relaxed">{item.desc || 'Fresh premium selection cooked to order.'}</p>
                                    
                                    <div className="mt-auto">
                                      <div className="flex items-center gap-1 mb-4">
                                        <span className="text-amber-400 text-sm">⭐</span>
                                        <span className="text-xs font-bold text-gray-700">{item.rating}</span>
                                        <span className="text-[10px] text-gray-400">({item.reviews})</span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="font-serif font-bold text-lg text-gray-900">₱{parseFloat(item.price).toFixed(0)}</span>
                                        {!isOutOfStock && (
                                          <div className="flex items-center gap-1.5">
                                            <div className="flex items-center bg-gray-50 border rounded-xl p-0.5 shadow-inner">
                                              <button onClick={() => updateLocalQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors text-xs">-</button>
                                              <span className="w-5 text-center font-bold text-xs text-gray-700">{localQuantities[item.id] || 1}</span>
                                              <button onClick={() => updateLocalQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors text-xs">+</button>
                                            </div>
                                            <button onClick={(e) => handleAddToCartClick(e, item)} className="w-8 h-8 bg-[#596643] text-white rounded-xl flex items-center justify-center shadow-md hover:bg-[#8b3a2b] transition-all duration-300">
                                              ➕
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Premium Desktop Sidebar Tray */}
          <div className="hidden lg:block w-[32%] xl:w-[28%] sticky top-36">
            <div id="desktop-tray-header" className={`bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ${bumpTray ? 'ring-4 ring-[#8b3a2b]/20 scale-[1.01]' : ''}`}>
              <div className="bg-[#3a352a] p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧺</span>
                  <h3 className="font-serif text-lg font-bold">Your Tray</h3>
                </div>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">{cartItemCount} items</span>
              </div>
              
              <div className="p-5">
                {cart.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">📭</div>
                    <p className="text-gray-400 text-xs font-light">Your order tray is fresh and empty.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4 hide-scrollbar">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group">
                          <img 
                            src={item.img} 
                            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
                            className="w-10 h-10 rounded-lg object-cover" 
                            alt="" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">₱{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateCartQty(item.id, -1)} className="w-5 h-5 bg-white border rounded flex items-center justify-center text-xs hover:bg-gray-100">-</button>
                            <span className="text-xs font-bold text-gray-700 w-3 text-center">{item.qty}</span>
                            <button onClick={() => updateCartQty(item.id, 1)} className="w-5 h-5 bg-white border rounded flex items-center justify-center text-xs hover:bg-gray-100">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-500 mb-4">
                      <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-gray-800">₱{cartSubtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Delivery Fee</span><span className="font-medium text-gray-800">₱{deliveryFee.toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 pt-2 border-t"><span>Total</span><span className="text-[#8b3a2b]">₱{grandTotal.toFixed(2)}</span></div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-3 bg-[#596643] hover:bg-[#455034] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-lg shadow-[#596643]/10 disabled:opacity-50"
                    >
                      {isCheckingOut ? "Processing..." : "Place Order Now"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Sticky CTA Trigger */}
      {cartItemCount > 0 && (
        <div className="lg:hidden fixed bottom-6 left-0 right-0 px-4 z-40">
          <button
            id="mobile-tray-btn"
            onClick={() => setShowMobileTray(true)}
            className="w-full bg-[#3a352a] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="bg-[#8b3a2b] text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs animate-bounce">
                {cartItemCount}
              </span>
              <span className="text-xs uppercase font-bold tracking-wider">View Basket</span>
            </div>
            <span className="font-serif font-bold text-base">₱{grandTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* --- MOBILE TRAY DRAWER MODAL --- */}
      {showMobileTray && (
        <div className="lg:hidden fixed inset-0 z-[120]">
          <div onClick={() => setShowMobileTray(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] max-h-[80vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="w-12 h-1 bg-gray-200 mx-auto my-3 rounded-full" />
            <div className="px-5 pb-3 border-b flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl">Your Order List</h3>
              <button onClick={() => setShowMobileTray(false)} className="w-7 h-7 bg-gray-100 rounded-full text-sm">✕</button>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-3 flex-1">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <img 
                    src={item.img} 
                    onError={(e) => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
                    className="w-12 h-12 rounded-lg object-cover" 
                    alt="" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate text-gray-800">{item.name}</h4>
                    <p className="text-xs font-bold text-[#8b3a2b] mt-1">₱{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border">
                    <button onClick={() => updateCartQty(item.id, -1)} className="text-xs font-bold px-1 text-gray-400">-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="text-xs font-bold px-1 text-gray-400">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t bg-gray-50 space-y-4">
              <div className="text-xs text-gray-500 space-y-1.5">
                <div className="flex justify-between"><span>Subtotal</span><span>₱{cartSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>₱{deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-bold text-gray-800 pt-2 border-t"><span>Total</span><span className="text-[#8b3a2b]">₱{grandTotal.toFixed(2)}</span></div>
              </div>
              <button 
                onClick={() => { setShowMobileTray(false); handleCheckout(); }} 
                className="w-full py-3.5 bg-[#596643] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-[#455034] transition-colors"
              >
                Place Order Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Walkthrough Modal */}
      {showWalkthrough && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl text-center relative border border-gray-100">
            <span className="text-4xl block mb-4">🥢</span>
            <h2 className="text-3xl font-serif font-bold text-gray-800">Welcome to Krave Kitchen</h2>
            <p className="text-xs text-gray-400 mt-2 font-light max-w-xs mx-auto leading-relaxed">
              Explore authentic East Asian delights cooked right by premier culinary experts.
            </p>
            <div className="mt-6 space-y-2 text-left bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="text-xs text-gray-600 flex gap-2"><span>✨</span> Select your favorites and see it fly to your tray.</div>
              <div className="text-xs text-gray-600 flex gap-2"><span>🔒</span> Log in anytime to sync your dynamic past checkouts.</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button onClick={() => { localStorage.setItem("krave-walkthrough", "true"); setShowWalkthrough(false); }} className="py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">Explore First</button>
              <Link href="/auth/login" className="py-3 bg-[#596643] text-white text-xs font-bold rounded-xl text-center shadow-md hover:bg-[#465134] flex items-center justify-center">Login / Join</Link>
            </div>
          </div>
        </div>
      )}

      {/* Authenticated Welcome Card */}
      {showWelcome && user && (
        <div className="fixed bottom-6 right-6 z-[100] bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-10 h-10 bg-[#596643] text-white font-bold rounded-xl flex items-center justify-center">
            {user.user_metadata?.full_name?.charAt(0).toUpperCase() || "K"}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800">Mabuhay, {user.user_metadata?.full_name || 'Ka-Krave'}!</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Your tailored premium dashboard is active.</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}