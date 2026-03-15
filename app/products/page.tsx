import { Metadata } from 'next';
import ProductGrid from './ProductGrid';
import { Suspense } from 'react';
import db from '@/lib/db';

export const metadata: Metadata = {
  title: 'Products | OrbitTech',
  description: 'Browse our extensive catalog of genuine technology electronics including laptops, networking gear, CCTV, and more.',
};

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { created_at: 'desc' }
  });

  // Serialize to plain objects
  const serializedProducts = products.map(p => ({
    ...p,
    price_rwf: Number(p.price_rwf),
    price_usd: p.price_usd ? Number(p.price_usd) : undefined,
    specifications: typeof p.specifications === 'object' && p.specifications !== null ? (p.specifications as Record<string, string>) : {},
    images: (p.images as string[]) || []
  }));

  return (
    <div className="bg-gray min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-slate mb-3">Our Products</h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            Discover our high-quality technology electronics. From powerful workstations to enterprise networking solutions.
          </p>
        </div>
        
        <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
          <ProductGrid initialProducts={serializedProducts} />
        </Suspense>
      </div>
    </div>
  );
}
