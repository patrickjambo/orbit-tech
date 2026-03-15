import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-dark text-orbit-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image 
              src="/logo.png" 
              alt="OrbitTech Logo" 
              width={48} 
              height={48} 
              className="object-contain mix-blend-screen brightness-[2.5] contrast-125 saturate-150" 
            />
            <h3 className="text-xl font-bold">OrbitTech</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">Your Trusted Tech Partner for Electronics, Networking, and Installations.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-accent"><Facebook size={20} /></a>
            <a href="#" className="hover:text-accent"><Instagram size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/products" className="hover:text-accent">Products</Link></li>
            <li><Link href="/services" className="hover:text-accent">Services</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2"><Phone size={16} /> 0783907794</li>
            <li className="flex items-center gap-2"><Mail size={16} /> Shemaclaude2021@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Nyarugenge,Kigali,Rwanda</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Admin</h4>
          <Link href="/admin/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Staff Login
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} OrbitTech Technology Electronics. All rights reserved.
      </div>
    </footer>
  );
}
