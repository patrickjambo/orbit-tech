import { Metadata } from 'next';
import { Camera, Wifi, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services & Installation | OrbitTech',
  description: 'Expert installation services for CCTV, Networking, and Electrical systems.',
};

export default function ServicesPage() {
  const services = [
    {
      id: 'cctv',
      title: 'CCTV & Security Installation',
      icon: <Camera className="w-12 h-12 text-primary" />,
      description: 'Comprehensive security solutions for your home or business. We install high-definition cameras, NVR/DVR systems, and configure remote viewing on your devices.',
      features: ['Indoor & Outdoor Cameras', 'Night Vision & Motion Tracking', 'Remote Mobile Access', '30-day Storage Setup']
    },
    {
      id: 'networking',
      title: 'Networking & WiFi Setup',
      icon: <Wifi className="w-12 h-12 text-primary" />,
      description: 'Reliable fast internet across your entire property. We handle structured cabling, router configuration, switches, and seamless mesh WiFi networks.',
      features: ['Structured Ethernet Cabling', 'Mesh WiFi Systems', 'Server Rack Installation', 'Network Security & Firewalls']
    },
    {
      id: 'electrical',
      title: 'Electrical Installations',
      icon: <Zap className="w-12 h-12 text-primary" />,
      description: 'Safe and certified electrical wiring for offices, data centers, and residential properties to support your heavy-duty technology requirements.',
      features: ['Office Wiring & Outlets', 'UPS & Power Backup Integration', 'Surge Protection', 'Energy Efficient Lighting']
    }
  ];

  return (
    <div className="bg-gray min-h-screen pb-20">
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Installation Services</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Beyond selling top-tier electronics, our certified technicians ensure they are installed properly and working flawlessly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 flex flex-col">
              <div className="bg-light-blue w-20 h-20 rounded-full flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold text-dark-slate mb-4">{service.title}</h2>
              <p className="text-slate-600 mb-6 flex-grow">{service.description}</p>
              
              <div className="mb-8">
                <h3 className="font-semibold text-dark-slate mb-3 border-b pb-2">What we provide:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-5 h-5 text-success shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={`/contact?service=${service.id}`}
                className="block text-center w-full py-3 bg-gray hover:bg-primary hover:text-white text-dark-slate font-semibold rounded-md transition-colors mt-auto"
              >
                Request a Quote
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
