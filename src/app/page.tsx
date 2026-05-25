import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- NAVIGATION --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900">
                Krave<span className="text-blue-600">System</span>
              </span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#" className="text-blue-600 font-semibold">Home</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition font-medium">Menu</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition font-medium">How It Works</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition font-medium">About Us</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition font-medium">Contact</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button className="text-slate-500 hover:text-blue-600 hidden sm:block transition">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button className="text-slate-500 hover:text-blue-600 relative transition">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">3</span>
              </button>
              <button className="hidden sm:inline-flex px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200/50">
                Login
              </button>
              {/* Mobile Hamburger */}
              <button className="lg:hidden p-2 -mr-2 text-slate-500 hover:text-blue-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center py-8 lg:py-16">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="inline-block bg-blue-100/50 text-blue-700 font-bold tracking-wider text-[10px] sm:text-xs px-3 py-1.5 rounded-full mb-5 sm:mb-6 uppercase border border-blue-200/50">
              Fast. Easy. Delicious.
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.15] mb-4 sm:mb-6 tracking-tight">
              Order Your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Favorites</span> in a <br className="hidden sm:block" />
              Few Clicks
            </h1>
            <p className="text-slate-500 text-base sm:text-lg mb-8 sm:mb-10 max-w-md sm:max-w-lg mx-auto lg:mx-0">
              Discover great food, exclusive deals and fast delivery to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2">
                Order Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2">
                Explore Menu <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative mt-4 lg:mt-0">
            {/* Hero Image Container */}
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-md lg:max-w-lg mx-auto">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" 
                alt="Delicious Burger" 
                className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl border-4 sm:border-8 border-white"
              />
              {/* Floating Badge - Centered on mobile, offset on desktop */}
              <div className="absolute -bottom-6 left-0 right-0 mx-auto w-[220px] sm:w-auto sm:mx-0 sm:left-4 lg:-left-8 z-20 bg-white/95 backdrop-blur px-4 py-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">Free Delivery</p>
                  <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">On orders over ₱499</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES STRIP --- */}
        <section className="py-12 mb-12 sm:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', title: 'Wide Selection', desc: 'Choose from hundreds of delicious items', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Fast Delivery', desc: 'Quick and reliable delivery at your door', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Secure Payment', desc: 'Multiple secure payment options', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: '24/7 Support', desc: "We're here to help anytime", color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg} ${feature.color}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- CATEGORIES --- */}
        <section className="mb-16 sm:mb-24">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <p className="text-blue-600 font-bold text-xs tracking-wider uppercase mb-1">Popular Categories</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Shop by Category</h2>
            </div>
            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
              View All
            </button>
          </div>
          
          {/* Scrollable Row */}
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 sm:pb-6 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { name: 'Burgers', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=150&q=80' },
              { name: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80' },
              { name: 'Chicken', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80' },
              { name: 'Pasta', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=150&q=80' },
              { name: 'Drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=150&q=80' },
              { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=150&q=80' },
            ].map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group min-w-[80px] sm:min-w-[100px]">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md transition group-hover:border-blue-100 bg-white">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <span className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition">{cat.name}</span>
              </div>
            ))}
            {/* 'More' Button */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group min-w-[80px] sm:min-w-[100px]">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition shadow-sm">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
              </div>
              <span className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition">More</span>
            </div>
          </div>
        </section>

        {/* --- PRODUCTS --- */}
        <section className="mb-16 sm:mb-24">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <p className="text-blue-600 font-bold text-xs tracking-wider uppercase mb-1">Popular Products</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Most Loved Items</h2>
            </div>
            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Classic Beef Burger', cat: 'Burgers', price: '199.00', rating: '4.8', reviews: '320', badge: 'Bestseller', badgeColor: 'bg-amber-400 text-amber-950', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
              { name: 'Cheese Pizza', cat: 'Pizza', price: '299.00', rating: '4.7', reviews: '210', badge: 'Popular', badgeColor: 'bg-emerald-400 text-emerald-950', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
              { name: 'Crispy Fried Chicken', cat: 'Chicken', price: '179.00', rating: '4.9', reviews: '180', badge: 'New', badgeColor: 'bg-blue-500 text-white', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80' },
              { name: 'Iced Chocolate', cat: 'Drinks', price: '99.00', rating: '4.6', reviews: '120', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-100 transition duration-300 group flex flex-col">
                {/* Image Container */}
                <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
                  {item.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md z-10 uppercase tracking-wide shadow-sm ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate pr-2">{item.name}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3">{item.cat}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.rating}</span>
                    <span className="text-xs sm:text-sm text-slate-400">({item.reviews})</span>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-lg sm:text-xl text-slate-900">₱{item.price}</span>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PROMO BANNER --- */}
        <section className="mb-16 sm:mb-24">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden border border-blue-100/50 shadow-sm">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="z-10 text-center md:text-left mb-8 md:mb-0 w-full md:w-auto">
              <span className="inline-block bg-blue-100/80 text-blue-700 font-bold text-[10px] sm:text-xs tracking-wider uppercase mb-3 px-3 py-1 rounded-full">Special Offer</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-5 leading-tight">
                Free Delivery <br className="hidden md:block" />
                on Your First Order!
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
                <span className="text-slate-600 font-medium text-sm sm:text-base">Use code:</span>
                <span className="bg-blue-600 text-white font-bold px-4 py-2 sm:py-2.5 rounded-lg tracking-wider shadow-md text-sm sm:text-base w-full sm:w-auto text-center border border-blue-500">
                  ORDERNOW
                </span>
              </div>
            </div>
            
            {/* Delivery Illustration */}
            <div className="z-10 w-full md:w-1/2 flex justify-center md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=500&q=80" 
                alt="Delivery Package" 
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-full border-4 sm:border-8 border-white shadow-xl rotate-3"
              />
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS & TRUST --- */}
        <section className="mb-10">
          <div className="mb-8 sm:mb-12 text-center md:text-left">
            <p className="text-blue-600 font-bold text-xs tracking-wider uppercase mb-1">How it Works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Ordering is as Easy as 1-2-3</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              { num: '1', title: 'Choose Your Items', desc: 'Browse our menu and add your favorites to cart.' },
              { num: '2', title: 'Checkout Securely', desc: 'Review your order and pay securely online.' },
              { num: '3', title: 'Enjoy Your Order', desc: "We'll deliver it fast right to your door." },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-row md:flex-col lg:flex-row items-center md:items-start lg:items-center text-center md:text-left gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xl sm:text-2xl flex items-center justify-center">
                  {step.num}
                </div>
                <div className="text-left md:text-center lg:text-left">
                  <h4 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
              {/* Avatars */}
              <div className="flex -space-x-3 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img 
                    key={i} 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white object-cover shadow-sm" 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    alt="Customer" 
                  />
                ))}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">Join 10,000+ Happy Customers</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs">Great food, fast delivery, and excellent service every time.</p>
              </div>
            </div>
            
            <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-8 w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-end gap-1.5 text-amber-400 mb-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 mr-1 sm:mr-2">4.8</span>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Based on 2,500+ reviews</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}