'use client';
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { User } from "@supabase/supabase-js";
import Header from './components/Header';
import Footer from './components/Footer';

// Helper component for the TikTok-style jump and zip animation
const FlyingImage = ({ id, startX, startY, endX, endY, img, onComplete }: any) => {
  const [phase, setPhase] = useState('start');

  useEffect(() => {
    // Phase 1: Immediately pop up and scale slightly above the click
    const popTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase('pop');
      });
    });

    // Phase 2: Zip to the cart target
    const flyTimer = setTimeout(() => {
      setPhase('fly');
    }, 250); // Hold the pop for a split second

    // Phase 3: Cleanup and trigger cart bump
    const doneTimer = setTimeout(() => {
      onComplete(id);
    }, 750); // Total animation time

    return () => {
      cancelAnimationFrame(popTimer);
      clearTimeout(flyTimer);
      clearTimeout(doneTimer);
    };
  }, [id, onComplete]);

  // Dynamic styles based on the current animation phase
  let style: React.CSSProperties = {
    left: startX,
    top: startY,
    transform: 'translate(-50%, -50%) scale(0)',
    opacity: 1,
    transition: 'none'
  };

  if (phase === 'pop') {
    // Jump up slightly from the button and scale up (TikTok pop effect)
    style = {
      left: startX,
      top: startY - 80, // Jump 80px up
      transform: 'translate(-50%, -50%) scale(1.1)',
      opacity: 1,
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' // Springy ease
    };
  } else if (phase === 'fly') {
    // Zip rapidly to the target coordinates while shrinking
    style = {
      left: endX,
      top: endY,
      transform: 'translate(-50%, -50%) scale(0.1)',
      opacity: 0.2,
      transition: 'all 0.5s cubic-bezier(0.5, 0, 0.2, 1)' // Fast swooping ease
    };
  }

  return (
    <img
      src={img}
      className="fixed z- w-20 h-20 rounded-xl object-cover border-2 border-[#8b3a2b] shadow-2xl pointer-events-none"
      style={style}
      alt="flying-product"
    />
  );
};

export default function LandingPage() {
  // State for mobile tray visibility (not fully implemented in this snippet, but set up for future use)
  const [showMobileTray, setShowMobileTray] = useState(false);

  // Router for navigation after logout
  const router = useRouter();

  // User authentication and welcome state
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  // Cart state and local quantity selectors for each product card
  const [cart, setCart] = useState<any[]>([]);
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  const [flyingItems, setFlyingItems] = useState<any[]>([]);
  
  // State to trigger the landing "bump" effect on the Header icon AND trays
  const [bumpTray, setBumpTray] = useState(false);

  const updateLocalQty = (itemName: string, delta: number) => {
    setLocalQuantities(prev => {
      const currentQty = prev[itemName] || 1;
      const newQty = Math.max(1, currentQty + delta);
      return { ...prev, [itemName]: newQty };
    });
  };

  const addToCart = (item: any) => {
    const qtyToAdd = localQuantities[item.name] || 1;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.name);
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].qty += qtyToAdd;
        return updatedCart;
      } else {
        const priceNum = parseFloat(item.price.replace(/,/g, ''));
        return [...prevCart, { ...item, id: item.name, qty: qtyToAdd, price: priceNum }];
      }
    });
    
    setLocalQuantities(prev => ({ ...prev, [item.name]: 1 }));
  };

  const handleAddToCartClick = (e: React.MouseEvent, item: any) => {
    // 1. Get click coordinates
    const startX = e.clientX;
    const startY = e.clientY;

    // 2. Determine target coordinates
    const isMobile = window.innerWidth < 1024;
    let endX = window.innerWidth / 2;
    let endY = 0;

    if (isMobile) {
      const mobileTray = document.getElementById('mobile-tray-btn');
      if (mobileTray) {
        const rect = mobileTray.getBoundingClientRect();
        endX = rect.left + 40; // Aim for the badge area
        endY = rect.top + rect.height / 2;
      } else {
        endY = window.innerHeight - 50;
      }
    } else {
      const headerCart = document.getElementById('header-cart-icon');
      if (headerCart) {
        const rect = headerCart.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
      } else {
        // Fallback to top right if header-cart-icon ID is missing in Header.tsx
        endX = window.innerWidth - 60;
        endY = 40;
      }
    }

    // 3. Trigger flying animation
    const id = Date.now() + Math.random().toString();
    setFlyingItems(prev => [...prev, { id, startX, startY, endX, endY, img: item.img }]);

    // 4. Update cart
    addToCart(item);
  };

  const removeFlyingItem = (id: string) => {
    setFlyingItems(prev => prev.filter(item => item.id !== id));
    
    // Trigger the bump effect when item lands
    setBumpTray(true);
    setTimeout(() => setBumpTray(false), 200); // Remove bump class after 200ms
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Check user session on mount and handle welcome/walkthrough logic
  useEffect(() => {

  checkUser();

}, []);

async function checkUser() {

  const { data } = await supabase.auth.getSession();

  if (data.session?.user) {

    setUser(data.session.user);

    // Warm welcome popup
    const welcomed =
      localStorage.getItem("krave-welcomed");

    if (!welcomed) {

      setShowWelcome(true);

      localStorage.setItem(
        "krave-welcomed",
        "true"
      );

      setTimeout(() => {
        setShowWelcome(false);
      }, 4000);

    }

  } else {

    // Guest walkthrough
    const walkthroughDone =
      localStorage.getItem(
        "krave-walkthrough"
      );

    if (!walkthroughDone) {

      setShowWalkthrough(true);

    }

  }

}

async function handleLogout() {

  await supabase.auth.signOut();

  localStorage.removeItem(
    "krave-welcomed"
  );

  router.push("/auth/login");

}

  return (
    <div className="min-h-screen bg-[#e0d7c5] text-[#3a352a] font-sans selection:bg-[#596643]/20 selection:text-[#8b3a2b]">
      
      {/* --- RENDER ANIMATIONS --- */}
      {flyingItems.map(item => (
        <FlyingImage key={item.id} {...item} onComplete={removeFlyingItem} />
      ))}

      {/* Passing bumpTray to Header so the cart icon can flash/bounce */}
      {/* <Header cartCount={cartItemCount} bumpCartIcon={bumpTray} /> */}
      <Header
        cartCount={cartItemCount}
        bumpCartIcon={bumpTray}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        
        {/* --- MOBILE PERSONALIZED WELCOME --- */}
        {user && (

          <section className="lg:hidden mb-6">

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#596643] via-[#4f5c3b] to-[#3a352a] p-6 shadow-2xl border border-white/10">

              {/* Decorative Blur */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8b3a2b]/30 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex items-center gap-4">

                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg">

                  {user.user_metadata?.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "K"}

                </div>

                {/* Text */}
                <div className="flex-1">

                  <p className="text-[#e0d7c5]/70 text-xs uppercase tracking-[0.2em] font-bold">
                    Welcome Back
                  </p>

                  <h2 className="text-white text-2xl font-bold leading-tight mt-1">
                    {user.user_metadata?.full_name || "Food Lover"} 👋
                  </h2>

                  <p className="text-[#e0d7c5]/80 text-sm mt-1 leading-relaxed">
                    Ready for your next delicious order today?
                  </p>

                </div>

              </div>

              {/* Bottom Stats */}
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">

                  <p className="text-[#e0d7c5]/70 text-[10px] uppercase tracking-widest font-bold">
                    Tray Items
                  </p>

                  <h3 className="text-white text-2xl font-bold mt-1">
                    {cartItemCount}
                  </h3>

                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">

                  <p className="text-[#e0d7c5]/70 text-[10px] uppercase tracking-widest font-bold">
                    Current Total
                  </p>

                  <h3 className="text-white text-2xl font-bold mt-1">
                    ₱{cartSubtotal.toFixed(0)}
                  </h3>

                </div>

              </div>

            </div>

          </section>

        )}
        {/* --- ORDERING HERO BANNER --- */}
        <section className="mb-12">
          <div className="bg-[#3a352a] rounded-[2rem] overflow-hidden relative flex flex-col md:flex-row items-center shadow-2xl border border-[#c2b9a7]/20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1712] via-[#3a352a]/90 to-transparent z-10 pointer-events-none"></div>
            
            <div className="p-8 md:p-14 md:w-3/5 z-20">
              <span className="inline-block bg-[#8b3a2b] text-white font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full shadow-md">
                Order Online
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#e0d7c5] leading-tight mb-6">
                Skip the line. <br />
                <span className="text-[#c2b9a7] italic font-light">Savor the flavor.</span>
              </h1>
              <p className="text-[#c2b9a7] font-light text-lg mb-10 max-w-md leading-relaxed">
                Get your favorite Southeast Asian dishes delivered hot and fresh directly to your door.
              </p>
              
              <div className="flex bg-white/5 p-1.5 rounded-xl backdrop-blur-md border border-white/10 w-full max-w-lg shadow-inner">
                <input 
                  type="text" 
                  placeholder="Search for your cravings..." 
                  className="bg-transparent text-[#e0d7c5] placeholder-[#c2b9a7]/70 px-5 py-3 outline-none w-full text-sm font-medium"
                />
                <button className="bg-[#596643] hover:bg-[#6c7a52] transition-colors text-white px-8 py-3 rounded-lg font-bold tracking-widest text-xs uppercase shadow-lg">
                  Search
                </button>
              </div>
            </div>

            <div className="hidden md:block md:w-2/5 h-full absolute right-0 top-0 z-0">
              <img 
                src="/logo.jpg" 
                alt="Delicious Asian Food" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* --- STICKY CATEGORY NAV --- */}
        <section className="sticky top-20 z-40 bg-[#e0d7c5]/95 backdrop-blur-md py-4 mb-10 border-b border-[#c2b9a7]/50 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex overflow-x-auto hide-scrollbar space-x-3 sm:space-x-4 pb-2">
            {['All Items', "Chef's Specials", 'Vietnamese Classics', 'Handcrafted Dimsum', 'Appetizers', 'Beverages'].map((cat, idx) => (
              <button 
                key={idx} 
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-sm ${
                  idx === 0 
                    ? 'bg-[#596643] text-white border-none' 
                    : 'bg-[#f4f1ea] text-[#3a352a] border border-[#c2b9a7]/40 hover:border-[#596643] hover:text-[#596643]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* --- MENU GRID SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Product Area */}
          <div className="lg:w-[70%] xl:w-[75%]">
            
            {/* --- CATEGORY 1: CHEF'S SPECIALS --- */}
            <div className="flex justify-between items-end mb-8 border-b border-[#c2b9a7]/50 pb-4">
              <h2 className="text-3xl font-serif text-[#3a352a] font-bold">Chef's Specials</h2>
              <span className="text-xs font-bold text-[#8b3a2b] uppercase tracking-widest bg-[#8b3a2b]/10 px-3 py-1 rounded-full">4 Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {[
                { name: 'Kare Kare Bagnet', cat: 'Filipino Fusion', price: '380.00', rating: '4.9', reviews: '320', img: '/assets/menu/kare-kare.png', badge: 'Must Try', desc: 'Traditional rich, savory peanut sauce served with crispy deep-fried pork belly instead of usual oxtail.' },
                { name: 'Mongo Bagnet', cat: 'Filipino Fusion', price: '290.00', rating: '4.8', reviews: '150', img: '/assets/menu/mongo-bagnet.png', desc: 'Hearty mung bean stew cooked with garlic, onions, tomatoes, topped with crispy bagnet.' },
                { name: 'Grilled Pork Belly', cat: 'Filipino Classics', price: '310.00', rating: '4.9', reviews: '245', img: '/assets/menu/pork-belly.png', badge: 'New', desc: 'Perfectly charred and marinated grilled pork belly served with our signature vinegar dip.' },
                { name: 'Special BBQ Skewers', cat: 'Barbeque', price: '220.00', rating: '4.7', reviews: '188', img: '/assets/menu/bbq-skewers.png', desc: 'Sweet and savory Filipino-style pork barbecue skewers, grilled to smoky perfection.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#c2b9a7]/30 overflow-hidden hover:shadow-xl hover:border-[#596643]/30 transition-all duration-300 flex flex-col group">
                  <div className="relative h-56 overflow-hidden bg-[#e0d7c5]">
                    {item.badge && (
                      <span className="absolute top-4 left-4 bg-[#8b3a2b] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest z-10 shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-[#3a352a] text-xl leading-tight group-hover:text-[#8b3a2b] transition-colors mb-1">{item.name}</h3>
                    <p className="text-[10px] text-[#596643] font-bold uppercase tracking-widest mb-3">{item.cat}</p>
                    <p className="text-sm text-[#3a352a]/70 font-light mb-6 line-clamp-3 leading-relaxed">{item.desc}</p>
                    
                    <div className="flex items-center gap-1.5 mb-6 mt-auto">
                      <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-sm font-bold text-[#3a352a]">{item.rating}</span>
                      <span className="text-xs text-[#3a352a]/50">({item.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-[#c2b9a7]/40">
                      <span className="font-serif font-bold text-2xl text-[#3a352a]">₱{item.price}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#f4f1ea] rounded-full border border-[#c2b9a7]/60 px-1 py-1 shadow-inner">
                          <button onClick={() => updateLocalQty(item.name, -1)} className="w-7 h-7 flex items-center justify-center text-[#596643] hover:bg-[#e0d7c5] rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-[#3a352a]">
                            {localQuantities[item.name] || 1}
                          </span>
                          <button onClick={() => updateLocalQty(item.name, 1)} className="w-7 h-7 flex items-center justify-center text-[#596643] hover:bg-[#e0d7c5] rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          </button>
                        </div>
                        <button onClick={(e) => handleAddToCartClick(e, item)} className="w-10 h-10 bg-[#596643] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#596643]/20 group-hover:bg-[#8b3a2b] group-hover:shadow-[#8b3a2b]/30 group-hover:-translate-y-0.5 active:scale-95">
                          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* --- CATEGORY 2: VIETNAMESE & ASIAN --- */}
            <div className="flex justify-between items-end mb-8 border-b border-[#c2b9a7]/50 pb-4">
              <h2 className="text-3xl font-serif text-[#3a352a] font-bold">Vietnamese & Asian</h2>
              <span className="text-xs font-bold text-[#8b3a2b] uppercase tracking-widest bg-[#8b3a2b]/10 px-3 py-1 rounded-full">5 Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {[
                { name: 'Pho Bo (Beef Pho)', cat: 'Noodles', price: '320.00', rating: '4.8', reviews: '210', img: '/assets/menu/pho-bo.png', desc: 'Tender slices of quality beef presented in a flavorful broth with rice noodles, fresh herbs, and bean sprouts.' },
                { name: 'Vietnamese Salad (Gỏi)', cat: 'Salad', price: '250.00', rating: '4.7', reviews: '115', img: '/assets/menu/vietnamese-salad.png', desc: 'A light, fresh, and flavorful salad made with raw vegetables, herbs, and a tangy-sweet dressing.' },
                { name: 'Gỏi Cuốn (Spring Rolls)', cat: 'Appetizers', price: '220.00', rating: '4.9', reviews: '400', img: '/assets/menu/spring-rolls.png', badge: 'Bestseller', desc: 'Fresh rice paper rolls filled with shrimp, pork, vermicelli, and herbs, served with hoisin-peanut sauce.' },
                { name: 'Beef Bánh Mì', cat: 'Sandwiches', price: '280.00', rating: '4.8', reviews: '305', img: '/assets/menu/banh-mi.png', desc: 'Vietnamese-style sandwich made with crispy French baguette filled with savory, flavorful beef and veggies.' },
                { name: 'Pad Thai', cat: 'Noodles', price: '260.00', rating: '4.9', reviews: '190', img: '/assets/menu/pad-thai.png', desc: 'Classic stir-fried rice noodles with shrimp, peanuts, scrambled egg, and bean sprouts.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#c2b9a7]/30 overflow-hidden hover:shadow-xl hover:border-[#596643]/30 transition-all duration-300 flex flex-col group">
                  <div className="relative h-56 overflow-hidden bg-[#e0d7c5]">
                    {item.badge && (
                      <span className="absolute top-4 left-4 bg-[#8b3a2b] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest z-10 shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-[#3a352a] text-xl leading-tight group-hover:text-[#8b3a2b] transition-colors mb-1">{item.name}</h3>
                    <p className="text-[10px] text-[#596643] font-bold uppercase tracking-widest mb-3">{item.cat}</p>
                    <p className="text-sm text-[#3a352a]/70 font-light mb-6 line-clamp-3 leading-relaxed">{item.desc}</p>
                    
                    <div className="flex items-center gap-1.5 mb-6 mt-auto">
                      <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-sm font-bold text-[#3a352a]">{item.rating}</span>
                      <span className="text-xs text-[#3a352a]/50">({item.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-[#c2b9a7]/40">
                      <span className="font-serif font-bold text-2xl text-[#3a352a]">₱{item.price}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#f4f1ea] rounded-full border border-[#c2b9a7]/60 px-1 py-1 shadow-inner">
                          <button onClick={() => updateLocalQty(item.name, -1)} className="w-7 h-7 flex items-center justify-center text-[#596643] hover:bg-[#e0d7c5] rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-[#3a352a]">
                            {localQuantities[item.name] || 1}
                          </span>
                          <button onClick={() => updateLocalQty(item.name, 1)} className="w-7 h-7 flex items-center justify-center text-[#596643] hover:bg-[#e0d7c5] rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          </button>
                        </div>
                        <button onClick={(e) => handleAddToCartClick(e, item)} className="w-10 h-10 bg-[#596643] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#596643]/20 group-hover:bg-[#8b3a2b] group-hover:shadow-[#8b3a2b]/30 group-hover:-translate-y-0.5 active:scale-95">
                          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* --- CATEGORY 3: DIMSUM & MONDAY SPECIALS --- */}
            <div className="flex justify-between items-end mb-8 border-b border-[#c2b9a7]/50 pb-4">
              <h2 className="text-3xl font-serif text-[#3a352a] font-bold">Appetizers & Dimsum</h2>
              <span className="text-xs font-bold text-[#8b3a2b] uppercase tracking-widest bg-[#8b3a2b]/10 px-3 py-1 rounded-full">4 Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
              {[
                { name: 'Chicken Cordon Bleu', cat: 'Main Course', price: '320.00', rating: '4.8', reviews: '210', img: '/assets/menu/chicken-cordon-bleus.jpg', desc: 'Crispy breaded chicken stuffed with ham and cheese, served with a rich and creamy sauce.' },
                { name: 'Hakaw', cat: 'Dimsum', price: '250.00', rating: '4.7', reviews: '115', img: '/assets/menu/hakaw.jpg', desc: 'Delicate shrimp dumplings wrapped in translucent wonton skin and served with flavorful dipping sauce.' },
                { name: 'Tamarind Prawn', cat: 'Monday Special', price: '350.00', rating: '4.9', reviews: '89', img: '/assets/menu/tamarind-prawn.png', badge: 'Promo', desc: 'Plump, juicy prawns tossed in a perfectly balanced sweet and tangy tamarind glaze.' },
                { name: 'Crab Rangoon', cat: 'Appetizers', price: '180.00', rating: '4.7', reviews: '156', img: '/assets/menu/crab-rangoon.png', desc: 'Crispy golden fried wontons generously filled with cream cheese and real crab meat.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#c2b9a7]/30 overflow-hidden hover:shadow-xl hover:border-[#596643]/30 transition-all duration-300 flex flex-col group">
                  <div className="relative h-56 overflow-hidden bg-[#e0d7c5]">
                    {item.badge && (
                      <span className="absolute top-4 left-4 bg-[#8b3a2b] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest z-10 shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-[#3a352a] text-xl leading-tight group-hover:text-[#8b3a2b] transition-colors mb-1">{item.name}</h3>
                    <p className="text-[10px] text-[#596643] font-bold uppercase tracking-widest mb-3">{item.cat}</p>
                    <p className="text-sm text-[#3a352a]/70 font-light mb-6 line-clamp-3 leading-relaxed">{item.desc}</p>
                    
                    <div className="flex items-center gap-1.5 mb-6 mt-auto">
                      <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-sm font-bold text-[#3a352a]">{item.rating}</span>
                      <span className="text-xs text-[#3a352a]/50">({item.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-[#c2b9a7]/40">
                      <span className="font-serif font-bold text-2xl text-[#3a352a]">₱{item.price}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#f4f1ea] rounded-full border border-[#c2b9a7]/60 px-1 py-1 shadow-inner">
                          <button onClick={() => updateLocalQty(item.name, -1)} className="w-7 h-7 flex items-center justify-center text-[#596643] hover:bg-[#e0d7c5] rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-[#3a352a]">
                            {localQuantities[item.name] || 1}
                          </span>
                          <button onClick={() => updateLocalQty(item.name, 1)} className="w-7 h-7 flex items-center justify-center text-[#596643] hover:bg-[#e0d7c5] rounded-full transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          </button>
                        </div>
                        <button onClick={(e) => handleAddToCartClick(e, item)} className="w-10 h-10 bg-[#596643] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#596643]/20 group-hover:bg-[#8b3a2b] group-hover:shadow-[#8b3a2b]/30 group-hover:-translate-y-0.5 active:scale-95">
                          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* --- SIDEBAR ORDER SUMMARY --- */}
          <div className="lg:w-[30%] xl:w-[25%] hidden lg:block">
            <div 
              className={`sticky top-40 bg-white rounded-[2rem] border border-[#c2b9a7]/50 shadow-2xl shadow-[#3a352a]/5 overflow-hidden transition-transform duration-200 ${bumpTray ? 'scale-[1.02] ring-4 ring-[#8b3a2b]/20' : 'scale-100'}`}
            >
              <div className="bg-[#3a352a] p-8 text-center border-b-[6px] border-[#8b3a2b]">
                <h3 className="font-serif text-2xl text-[#e0d7c5] font-bold">Your Tray</h3>
              </div>
              
              <div className="p-8">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center border-b border-dashed border-[#c2b9a7] mb-8">
                    <div className="w-20 h-20 bg-[#f4f1ea] rounded-full flex items-center justify-center text-[#c2b9a7] mb-5 shadow-inner">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-[#3a352a]/70 font-light text-sm leading-relaxed">Your tray is empty.<br/>Add some delicious food!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 border-b border-dashed border-[#c2b9a7] pb-8 mb-8 max-h-64 overflow-y-auto hide-scrollbar">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="flex gap-3 items-center">
                           <img src={item.img} className="w-12 h-12 rounded object-cover border border-[#c2b9a7]/30" alt={item.name} />
                           <div>
                             <p className="font-bold text-sm text-[#3a352a] leading-tight line-clamp-1">{item.name}</p>
                             <p className="text-xs font-bold text-[#596643] mt-1">{item.qty} x ₱{item.price.toFixed(2)}</p>
                           </div>
                        </div>
                        <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 mb-8 px-2">
                  <div className="flex justify-between text-sm text-[#3a352a]/80 font-light">
                    <span>Subtotal</span>
                    <span className="font-medium">₱{cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8 pt-6 border-t border-[#c2b9a7]/50 px-2">
                  <span className="font-bold text-[#3a352a] uppercase tracking-widest text-xs">Total</span>
                  <span className="font-serif font-bold text-3xl text-[#8b3a2b]">₱{cartSubtotal.toFixed(2)}</span>
                </div>

                <button 
                  disabled={cart.length === 0}
                  className={`w-full py-4 text-xs font-bold tracking-widest uppercase text-white rounded-xl transition duration-300 shadow-lg ${
                    cart.length === 0 
                      ? 'bg-[#c2b9a7] shadow-none cursor-not-allowed' 
                      : 'bg-[#596643] hover:bg-[#4a5537] shadow-[#596643]/30'
                  }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- MOBILE FLOATING CART BUTTON --- */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 px-4 z-50">
        <button
          id="mobile-tray-btn"
          onClick={() =>
            setShowMobileTray(true)
          }
          className={`w-full text-[#e0d7c5] p-5 rounded-2xl shadow-2xl flex items-center justify-between font-bold uppercase tracking-widest text-xs border-2 transition-all duration-200 ${
            bumpTray ? 'bg-[#4a5537] border-[#8b3a2b] scale-105' : 'bg-[#3a352a] border-[#596643] scale-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-white w-8 h-8 flex items-center justify-center rounded-full text-xs shadow-inner transition-colors duration-200 ${bumpTray ? 'bg-amber-500 text-black' : 'bg-[#8b3a2b]'}`}>
              {cartItemCount}
            </span>
            <span>View Tray</span>
          </div>
          <span className="font-serif text-lg text-white">₱{cartSubtotal.toFixed(2)}</span>
        </button>
      </div>
      
      {/* WELCOME MODAL */}
      {showWelcome && user && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#596643] text-white flex items-center justify-center text-3xl mb-5">
              🍜
            </div>

            <h2 className="text-3xl font-bold text-[#3a352a]">
              Welcome Back!
            </h2>

            <p className="text-slate-500 mt-3">
              Glad to see you again,
              <span className="font-semibold text-[#596643]">
                {" "}
                {user.user_metadata?.full_name || "Food Lover"}
              </span>
            </p>

          </div>

        </div>

      )}


      {/* WALKTHROUGH MODAL */}
      {showWalkthrough && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl">

            <span className="bg-[#8b3a2b] text-white px-4 py-1 rounded-full text-xs uppercase tracking-widest font-bold">
              Welcome Guest
            </span>

            <h2 className="text-4xl font-bold text-[#3a352a] mt-5 leading-tight">
              Welcome to Krave Kitchen 🍜
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed">
              Discover Southeast Asian flavors, add meals to your tray,
              and enjoy a smooth ordering experience.
            </p>

            <div className="mt-8 space-y-3">

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-[#596643] text-white flex items-center justify-center text-sm">
                  1
                </div>
                <p className="text-sm text-slate-600">
                  Browse our chef specials and handcrafted dishes.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-[#596643] text-white flex items-center justify-center text-sm">
                  2
                </div>
                <p className="text-sm text-slate-600">
                  Login or create your account to continue ordering.
                </p>
              </div>

            </div>

            <div className="flex gap-3 mt-10">

              <button
                onClick={() => {
                  localStorage.setItem(
                    "krave-walkthrough",
                    "true"
                  );

                  setShowWalkthrough(false);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200"
              >
                Continue as Guest
              </button>

              <Link
                href="/auth/login"
                className="flex-1 py-3 rounded-xl bg-[#596643] text-white text-center"
              >
                Login
              </Link>

            </div>

          </div>

        </div>

      )}

      {/* --- MOBILE TRAY DRAWER --- */}
      {showMobileTray && (

        <div className="lg:hidden fixed inset-0 z-[120]">

          {/* BACKDROP */}
          <div
            onClick={() =>
              setShowMobileTray(false)
            }
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">

            {/* HANDLE */}
            <div className="flex justify-center pt-3">
              <div className="w-14 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200">

              <div>

                <h2 className="text-2xl font-bold text-[#3a352a]">
                  Your Tray
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {cartItemCount} item(s)
                </p>

              </div>

              <button
                onClick={() =>
                  setShowMobileTray(false)
                }
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
              >
                ✕
              </button>

            </div>

            {/* CONTENT */}
            <div className="overflow-y-auto max-h-[50vh] px-6 py-5">

              {cart.length === 0 ? (

                <div className="py-16 text-center">

                  <div className="w-20 h-20 mx-auto rounded-full bg-[#f4f1ea] flex items-center justify-center mb-5">
                    🛒
                  </div>

                  <h3 className="text-xl font-bold text-[#3a352a]">
                    Tray Empty
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Add delicious meals first.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-[#f8f5ef] rounded-2xl p-4 border border-[#e0d7c5]"
                    >

                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />

                      <div className="flex-1">

                        <h3 className="font-bold text-[#3a352a] leading-tight">
                          {item.name}
                        </h3>

                        <p className="text-sm text-[#596643] font-semibold mt-1">
                          Qty: {item.qty}
                        </p>

                        <p className="text-lg font-bold text-[#8b3a2b] mt-2">
                          ₱
                          {(item.price * item.qty).toFixed(2)}
                        </p>

                      </div>

                      {/* REMOVE BUTTON */}
                      <button
                        onClick={() =>
                          handleRemoveFromCart(
                            item.id
                          )
                        }
                        className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-200 transition flex items-center justify-center text-red-500"
                      >
                        🗑️
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-200 p-6 bg-white">

              <div className="flex justify-between items-center mb-5">

                <span className="text-sm uppercase tracking-widest font-bold text-slate-500">
                  Total
                </span>

                <span className="text-3xl font-bold text-[#8b3a2b]">
                  ₱{cartSubtotal.toFixed(2)}
                </span>

              </div>

              <button
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-2xl text-white font-bold uppercase tracking-widest text-sm transition ${
                  cart.length === 0
                    ? "bg-slate-300"
                    : "bg-[#596643] hover:bg-[#4a5537]"
                }`}
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        </div>

      )}

      <Footer />
      
    </div>
  );
}