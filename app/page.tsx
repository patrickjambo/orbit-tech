import HeroSlider from '@/components/HeroSlider';
import Link from 'next/link';
import { ShieldCheck, PenTool, Wrench, Package, Cpu, Monitor, Wifi, Camera } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Laptops & Computers', icon: <Cpu className="w-8 h-8 md:w-10 md:h-10 text-primary" />, slug: 'Computers & Main Devices', desc: 'Powerful machines for all needs.' },
    { name: 'Monitors & Displays', icon: <Monitor className="w-8 h-8 md:w-10 md:h-10 text-primary" />, slug: 'Display & Output Devices', desc: 'Crystal clear output.' },
    { name: 'Networking', icon: <Wifi className="w-8 h-8 md:w-10 md:h-10 text-primary" />, slug: 'Networking Devices', desc: 'Stay connected everywhere.' },
    { name: 'CCTV & Security', icon: <Camera className="w-8 h-8 md:w-10 md:h-10 text-primary" />, slug: 'CCTV & Surveillance Systems', desc: 'Protect what matters most.' },
  ];

  const trustFeatures = [
    { title: 'Genuine Products', icon: <Package className="w-12 h-12 text-accent mx-auto mb-4" />, desc: '100% authentic tech and electronics from trusted top brands.' },
    { title: 'Expert Installation', icon: <Wrench className="w-12 h-12 text-accent mx-auto mb-4" />, desc: 'Professional installation for CCTV, Networking, and Electrical systems.' },
    { title: 'After-Sales Support', icon: <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-4" />, desc: 'Dedicated customer service and tech support post-purchase.' },
  ];

  return (
    <>
      <HeroSlider />
      
      {/* Featured Categories */}
      <section className="py-16 bg-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-slate mb-4">Shop by Category</h2>
            <p className="text-lg text-slate-600">Explore our wide range of premium electronics.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <Link key={idx} href={`/products?category=${cat.slug}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                <div className="bg-light-blue p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-xl text-dark-slate mb-2">{cat.name}</h3>
                <p className="text-sm text-slate-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
             <Link href="/products" className="text-primary font-medium hover:text-accent flex items-center justify-center gap-2">View All Categories &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white shrink-0">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
               {trustFeatures.map((feature, idx) => (
                 <div key={idx}>
                    {feature.icon}
                    <h3 className="text-xl font-bold text-dark-slate mb-2">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-primary text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-1/2">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Professional Installation?</h2>
               <p className="text-lg text-blue-200 mb-6">From complex networking to full CCTV coverage and electrical installations, our experts are ready.</p>
               <Link href="/services" className="inline-flex items-center gap-2 bg-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-medium transition-colors">
                  <PenTool className="w-5 h-5" /> View Our Services
               </Link>
            </div>
            <div className="md:w-5/12 grid grid-cols-1 gap-4">
               <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-default">
                  <h4 className="font-semibold text-lg flex items-center gap-2"><Camera className="w-5 h-5 text-accent" /> CCTV Installation</h4>
               </div>
               <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-default">
                   <h4 className="font-semibold text-lg flex items-center gap-2"><Wifi className="w-5 h-5 text-accent" /> Networking Setup</h4>
               </div>
            </div>
         </div>
      </section>
    </>
  );
}
