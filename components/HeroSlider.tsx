'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  { id: 1, title: 'Powerful Machines for Work & Play', subtitle: 'Laptops & Computers', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80', cta: 'Shop Now', link: '/products?category=laptops' },
  { id: 2, title: 'Stay Connected Everywhere', subtitle: 'Networking Gear', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80', cta: 'View Products', link: '/products?category=networking' },
  { id: 3, title: 'Protect What Matters', subtitle: 'CCTV & Security', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80', cta: 'Explore Solutions', link: '/products?category=security' },
  { id: 4, title: 'We Install, You Relax', subtitle: 'Installation Services', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80', cta: 'Our Services', link: '/services' },
];

export default function HeroSlider() {
  return (
    <div className="w-full h-[80vh] bg-slate-900 relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image src={slide.image} alt={slide.title} fill className="object-cover opacity-60" priority={slide.id === 1} />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 text-center text-white px-4 flex flex-col items-center">
                <span className="uppercase tracking-widest text-accent font-semibold mb-4 text-sm md:text-base">{slide.subtitle}</span>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl leading-tight">{slide.title}</h2>
                <Link href={slide.link} className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium text-lg transition-transform transform hover:scale-105">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
