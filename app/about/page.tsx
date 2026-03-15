import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | OrbitTech',
  description: 'Learn more about OrbitTech - your trusted partner for technology and electronics.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-slate mb-6">About OrbitTech</h1>
          <p className="text-lg text-slate-600">
            We are dedicated to providing the highest quality technology electronics and professional installation services to homes and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-dark-slate mb-4">Our Story</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Founded with the mission to bridge the gap between premium electronics and reliable setup, OrbitTech has grown into a trusted technology partner. We understand that buying great equipment is only half the journey—ensuring it is installed and configured perfectly is where we excel.
            </p>
            <p className="text-slate-600 leading-relaxed">
              From top-of-the-line laptops and performance displays to enterprise-grade networking and CCTV systems, we source only genuine products. Our certified technical team is always ready to deploy, configure, and maintain your technology infrastructure.
            </p>
          </div>
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-inner">
            <Image 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80" 
              alt="OrbitTech Workspace" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-primary text-white p-8 rounded-xl shadow-sm">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Projects Completed</div>
          </div>
          <div className="bg-primary text-white p-8 rounded-xl shadow-sm">
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-blue-200">Genuine Products</div>
          </div>
          <div className="bg-primary text-white p-8 rounded-xl shadow-sm">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-blue-200">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
