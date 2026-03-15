'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-wave-gradient text-orbit-white sticky top-0 z-50 shadow-md border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center relative">
            <div className="orbit-ring pointer-events-none"></div>
            <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-widest uppercase z-10">
              <Image 
                src="/logo.png" 
                alt="OrbitTech Logo" 
                width={55} 
                height={55} 
                className="object-contain mix-blend-screen brightness-[2.5] contrast-125 saturate-150 relative z-10 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]" 
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orbit-white to-accent drop-shadow-sm">OrbitTech</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-accent font-medium uppercase tracking-widest text-sm transition-colors">Home</Link>
            <Link href="/products" className="hover:text-accent font-medium uppercase tracking-widest text-sm transition-colors">Products</Link>
            <Link href="/services" className="hover:text-accent font-medium uppercase tracking-widest text-sm transition-colors">Services</Link>
            <Link href="/about" className="hover:text-accent font-medium uppercase tracking-widest text-sm transition-colors">About</Link>
            <Link href="/contact" className="hover:text-accent font-medium uppercase tracking-widest text-sm transition-colors">Contact</Link>
            
            {/* Staff Login Button */}
            <div className="pl-4 border-l border-white/20">
              <Link href="/admin/login" className="flex items-center gap-2 bg-white/10 hover:bg-accent/80 text-orbit-white px-4 py-2 rounded-full font-medium tracking-wide text-xs transition-all ring-1 ring-white/30 hover:ring-accent backdrop-blur-sm">
                <UserCircle size={16} />
                STAFF LOGIN
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-orbit-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#11264c] px-4 pt-2 pb-6 space-y-2 border-b border-accent/30 shadow-inner">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-center border border-white/5 hover:bg-white/10">Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-center border border-white/5 hover:bg-white/10">Products</Link>
          <Link href="/services" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-center border border-white/5 hover:bg-white/10">Services</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-center border border-white/5 hover:bg-white/10">About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md font-medium text-center border border-white/5 hover:bg-white/10">Contact</Link>
          <div className="pt-4 mt-2 border-t border-white/10">
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/80 text-orbit-white px-4 py-3 rounded-md font-bold tracking-wide text-sm transition-all shadow-md">
              <UserCircle size={18} />
              STAFF LOGIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
