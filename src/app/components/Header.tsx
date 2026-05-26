'use client';

import React, { useState, useEffect } from 'react';

// Added cartCount prop
export default function Header({ cartCount = 0 }: { cartCount?: number }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-[#e0d7c5]/95 backdrop-blur-md shadow-md py-1 border-b border-[#c2b9a7]/80' 
          : 'bg-[#e0d7c5] py-3 border-b border-[#e0d7c5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 transition-all duration-300">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#596643] shadow-sm group-hover:scale-105 transition-transform duration-300 bg-white flex items-center justify-center">
              <img 
                src="/logo.jpg" 
                alt="Krave Kitchen Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-[#596643]', 'text-[#e0d7c5]', 'border-transparent');
                  e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11V3m0 8c-1.11 0-2 .89-2 2v6h4v-6c0-1.11-.89-2-2-2zM7 3v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V3M7 3h10" /></svg>');
                }}
              />
            </div>
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-widest text-[#3a352a] uppercase group-hover:text-[#596643] transition-colors">
              Krave<span className="text-[#596643] font-sans font-light tracking-normal ml-1 group-hover:text-[#8b3a2b] transition-colors">Kitchen</span>
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10">
            <a href="#" className="text-[#8b3a2b] font-medium tracking-widest uppercase text-xs border-b border-[#8b3a2b] pb-1 hover:opacity-80 transition">Discover</a>
            <a href="#specials" className="text-[#596643] hover:text-[#8b3a2b] transition font-medium tracking-widest uppercase text-xs pb-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[#8b3a2b] after:transition-all after:duration-300">Specials</a>
            <a href="#menu" className="text-[#596643] hover:text-[#8b3a2b] transition font-medium tracking-widest uppercase text-xs pb-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[#8b3a2b] after:transition-all after:duration-300">Menu</a>
            <a href="#visit" className="text-[#596643] hover:text-[#8b3a2b] transition font-medium tracking-widest uppercase text-xs pb-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[#8b3a2b] after:transition-all after:duration-300">Visit Us</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 sm:gap-6">
            <button className="text-[#596643] hover:text-[#8b3a2b] relative transition hidden sm:block group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#8b3a2b] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="hidden sm:flex items-center gap-4 border-l border-[#c2b9a7]/50 pl-6">
              <button className="text-[#3a352a] font-bold tracking-widest text-xs uppercase hover:text-[#8b3a2b] transition-colors">
                Login
              </button>
              <button className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-[#e0d7c5] bg-[#596643] rounded hover:bg-[#3a352a] hover:-translate-y-0.5 transition-all duration-300 shadow-md shadow-[#596643]/20">
                Order Now
              </button>
            </div>
            
            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-[#596643] hover:text-[#8b3a2b] transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'}`} />
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0 top-3' : 'top-3'}`} />
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'}`} />
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-[#e0d7c5]/95 backdrop-blur-xl border-b border-[#c2b9a7]/60 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out origin-top ${
          isMobileMenuOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <nav className="flex flex-col items-center space-y-6 px-4">
          <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8b3a2b] font-bold tracking-widest uppercase text-sm">Discover</a>
          <a href="#specials" onClick={() => setIsMobileMenuOpen(false)} className="text-[#3a352a] hover:text-[#8b3a2b] font-medium tracking-widest uppercase text-sm transition">Specials</a>
          <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="text-[#3a352a] hover:text-[#8b3a2b] font-medium tracking-widest uppercase text-sm transition">Menu</a>
          <a href="#visit" onClick={() => setIsMobileMenuOpen(false)} className="text-[#3a352a] hover:text-[#8b3a2b] font-medium tracking-widest uppercase text-sm transition">Visit Us</a>
          
          <div className="w-full pt-6 border-t border-[#c2b9a7]/40 flex flex-col items-center gap-4">
            <button className="flex items-center gap-2 text-[#596643] hover:text-[#8b3a2b] font-bold tracking-widest uppercase text-sm transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              View Cart ({cartCount})
            </button>
            <button className="w-full max-w-xs px-6 py-4 text-sm font-bold tracking-widest uppercase text-[#3a352a] border border-[#c2b9a7] bg-transparent rounded hover:bg-[#c2b9a7]/20 transition duration-300 shadow-sm">
              Login
            </button>
            <button className="w-full max-w-xs px-6 py-4 text-sm font-bold tracking-widest uppercase text-[#e0d7c5] bg-[#596643] rounded hover:bg-[#3a352a] transition duration-300 shadow-md">
              Order Now
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}