'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header({ 
  bumpCartIcon = false,
  user,
  onLogout
}: {
  bumpCartIcon?: boolean;
  user?: any;
  onLogout?: () => void;
}) {
  const { cart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === '/';

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Kunin ang count (kung ilan ang items sa cart)
  const cartCount = isMounted ? cart.length : 0;

  // SMART SCROLL FUNCTION: Ligtas na mag-ma-maniobra pababa sa dulo ng kasalukuyang page nang hindi lumilipat ng route
  const handleVisitClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false); // Siguraduhing magsasara ang mobile drawer menu kung sakaling doon kinlik

    if (!isHomePage) {
      e.preventDefault(); // Pipigilan natin ang default navigation papuntang homepage gamit ang Link href
      
      // Hahanapin natin ang element na may id="visit" (na dapat nakakabit sa labas o loob ng iyong Footer)
      const visitSection = document.getElementById('visit');
      
      if (visitSection) {
        visitSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback kung sakaling hindi mahanap ang ID, dumeretso sa pinakailalim ng bintana kung nasaan ang Footer
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

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
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#596643] shadow-sm group-hover:scale-105 transition-transform duration-300 bg-white flex items-center justify-center">
              <img 
                src="/logo.jpg" 
                alt="Krave Kitchen Logo"
                width={100}
                height={100}
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
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link 
              href="/" 
              className={`font-medium tracking-widest uppercase text-xs pb-1 transition ${
                isHomePage ? 'text-[#8b3a2b] border-b border-[#8b3a2b] hover:opacity-80' : 'text-[#596643] hover:text-[#8b3a2b]'
              }`}
            >
              Discover
            </Link>

            <Link 
              href="/menu" 
              className={`font-medium tracking-widest uppercase text-xs pb-1 transition relative after:absolute after:bottom-0 after:left-0 after:h-px after:transition-all after:duration-300 ${
                pathname === '/menu' 
                  ? 'text-[#8b3a2b] border-b border-[#8b3a2b]' 
                  : 'text-[#596643] hover:text-[#8b3a2b] after:w-0 hover:after:w-full after:bg-[#8b3a2b]'
              }`}
            >
              Menu
            </Link>

            {/* INTEGRATED INTELLIGENT VISIT LINK */}
            <Link 
              href={isHomePage ? '#visit' : '/#visit'} 
              onClick={handleVisitClick}
              className="text-[#596643] hover:text-[#8b3a2b] transition font-medium tracking-widest uppercase text-xs pb-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[#8b3a2b] after:transition-all after:duration-300"
            >
              Visit Us
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Palitan ang button ng Link */}
            <Link 
              href="/cart" 
              id="header-cart-icon" 
              className={`text-[#596643] hover:text-[#8b3a2b] relative transition-transform duration-200 hidden sm:block group ${
                bumpCartIcon ? 'scale-125 text-[#8b3a2b]' : 'scale-100'
              }`}
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartCount > 0 && (
                <span className={`absolute -top-1.5 -right-2 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm transition-colors duration-200 ${
                  bumpCartIcon ? 'bg-amber-500 text-black' : 'bg-[#8b3a2b]'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="hidden sm:flex items-center gap-4 border-l border-[#c2b9a7]/50 pl-6">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase text-[#596643]">
                    Hi, {user.user_metadata?.full_name || "User"}
                  </span>
                  <button
                    onClick={onLogout}
                    className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-[#3a352a] border border-[#c2b9a7] bg-transparent rounded hover:bg-[#c2b9a7]/20 hover:text-red-500 transition duration-300 shadow-sm text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-[#3a352a] font-bold tracking-widest text-xs uppercase hover:text-[#8b3a2b] transition-colors"
                >
                  Login
                </Link>
              )}
              
              <Link 
                href="/menu" 
                className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-[#e0d7c5] bg-[#596643] rounded hover:bg-[#3a352a] hover:-translate-y-0.5 transition-all duration-300 shadow-md shadow-[#596643]/20"
              >
                Order Now
              </Link>
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
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#3a352a] hover:text-[#8b3a2b] font-medium tracking-widest uppercase text-sm transition">
            Discover
          </Link>
          <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8b3a2b] font-bold tracking-widest uppercase text-sm">
            Menu
          </Link>
          
          {/* MOBILE VISIT US LINK WITH SAME INTERACTIVE SCROLL EVENT */}
          <Link 
            href={isHomePage ? '#visit' : '/#visit'} 
            onClick={handleVisitClick}
            className="text-[#3a352a] hover:text-[#8b3a2b] font-medium tracking-widest uppercase text-sm transition"
          >
            Visit Us
          </Link>
          
          <div className="w-full pt-6 border-t border-[#c2b9a7]/40 flex flex-col items-center gap-4">
            {/* Palitan ang <button> ng <Link> */}
            <Link 
              href="/cart" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-[#596643] hover:text-[#8b3a2b] font-bold tracking-widest uppercase text-sm transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              View Cart ({cartCount})
            </Link>
            {user ? (
              <button
                onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                className="w-full max-w-xs px-6 py-4 text-sm font-bold tracking-widest uppercase text-red-500 border border-red-200 bg-white rounded hover:bg-red-50 transition duration-300 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full max-w-xs px-6 py-4 text-sm font-bold tracking-widest uppercase text-[#3a352a] border border-[#c2b9a7] bg-transparent rounded hover:bg-[#c2b9a7]/20 transition duration-300 shadow-sm text-center"
              >
                Login
              </Link>
            )}
            <Link 
              href="/menu" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-full max-w-xs px-6 py-4 text-sm font-bold tracking-widest uppercase text-[#e0d7c5] bg-[#596643] rounded hover:bg-[#3a352a] transition duration-300 shadow-md text-center"
            >
              Order Now
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}