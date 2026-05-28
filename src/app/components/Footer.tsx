import React from 'react';

export default function Footer() {
  return (
    <footer id="visit" className="bg-[#3a352a] text-[#e0d7c5] pt-20 pb-10 mt-12 relative overflow-hidden">
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#596643] via-[#8b3a2b] to-[#596643]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-[#e0d7c5]/10 pb-16">
          
          {/* Column 1: Brand & Address */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-serif font-bold text-2xl tracking-widest text-[#e0d7c5] uppercase mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#596643]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11V3m0 8c-1.11 0-2 .89-2 2v6h4v-6c0-1.11-.89-2-2-2zM7 3v6c0 1.11.89 2 2 2h6c1.11 0 2-.89 2-2V3M7 3h10" />
              </svg>
              Krave<span className="text-[#596643] font-sans font-light tracking-normal ml-1">Kitchen</span>
            </span>
            <p className="font-light text-sm opacity-80 leading-relaxed max-w-xs">
              79B Katipunan Ave.<br />
              White Plains, Quezon City,<br />
              Philippines
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="font-bold tracking-widest uppercase text-xs text-[#8b3a2b] mb-6">Explore</p>
            <div className="space-y-3 flex flex-col">
              <a href="#menu" className="text-sm font-light text-[#e0d7c5]/80 hover:text-[#596643] hover:translate-x-1 transition-all duration-300">Our Menu</a>
              <a href="#" className="text-sm font-light text-[#e0d7c5]/80 hover:text-[#596643] hover:translate-x-1 transition-all duration-300">Reservations</a>
              <a href="#" className="text-sm font-light text-[#e0d7c5]/80 hover:text-[#596643] hover:translate-x-1 transition-all duration-300">Private Events</a>
              <a href="#" className="text-sm font-light text-[#e0d7c5]/80 hover:text-[#596643] hover:translate-x-1 transition-all duration-300">Gift Cards</a>
            </div>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="font-bold tracking-widest uppercase text-xs text-[#8b3a2b] mb-6">Contact & Hours</p>
            <div className="space-y-4">
              <div>
                <a href="tel:+639178801207" className="font-serif text-lg text-white hover:text-[#596643] transition-colors block">+63 917 880 1207</a>
                <a href="tel:0284428874" className="font-serif text-lg text-white hover:text-[#596643] transition-colors block">(02) 8442 8874</a>
              </div>
              <div className="text-xs text-[#e0d7c5]/80 font-light leading-relaxed">
                <p>Mon - Fri: 10:00 AM - 9:00 PM</p>
                <p>Sat - Sun: 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="font-bold tracking-widest uppercase text-xs text-[#8b3a2b] mb-6">Stay Updated</p>
            <p className="text-sm font-light text-[#e0d7c5]/80 mb-4">Join our mailing list for seasonal menus and exclusive invitations.</p>
            <div className="flex w-full max-w-xs border-b border-[#e0d7c5]/30 focus-within:border-[#596643] transition-colors pb-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-[#e0d7c5]/50" 
              />
              <button className="text-[#8b3a2b] hover:text-[#596643] transition-colors uppercase text-xs tracking-widest font-bold px-2">Join</button>
            </div>
          </div>

        </div>

        {/* Sub-Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-light text-[#e0d7c5]/50 tracking-wider">
          <p>&copy; {new Date().getFullYear()} Krave Kitchen. All rights reserved.</p>
          
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            
            {/* Social Icons */}
            <div className="flex gap-4 ml-2 pl-6 border-l border-[#e0d7c5]/20">
              <a href="#" className="text-[#e0d7c5]/80 hover:text-[#596643] transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-[#e0d7c5]/80 hover:text-[#596643] transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}