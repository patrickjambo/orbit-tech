import db from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, XCircle, ArrowLeft, Send } from 'lucide-react';

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const product = await db.product.findUnique({
    where: { id: params.id }
  });
  
  if (!product) {
    notFound();
  }

  // Handle JSON casting
  const specsObject = typeof product.specifications === 'object' && product.specifications !== null 
    ? product.specifications 
    : {};
  const specs = Object.entries(specsObject);
  
  const images = (product.images as string[]) || [];

  return (
    <div className="bg-gray min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/products" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[400px] relative">
               {!product.in_stock && (
                  <div className="absolute top-6 right-6 bg-error text-white font-bold px-4 py-2 rounded-md shadow-md z-10">
                    Out of Stock
                  </div>
               )}
               <div className="relative w-full aspect-square max-w-md">
                 {images[0] ? (
                   <Image 
                     src={images[0]} 
                     alt={product.name} 
                     fill 
                     className="object-contain"
                     priority
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gray-100 rounded-xl">No Image Available</div>
                 )}
               </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                 <span className="bg-light-blue text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {product.category}
                 </span>
                 <span className="text-slate-500 text-sm font-medium">SKU: {product.sku || 'N/A'}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-dark-slate mb-4">{product.name}</h1>
              <p className="text-lg text-slate-600 mb-8">{product.description}</p>
              
              <div className="mb-8">
                 <div className="text-4xl font-bold text-primary mb-2 flex items-end gap-3">
                   RWF {Number(product.price_rwf).toLocaleString()}
                   {product.price_usd && <span className="text-xl text-slate-400 font-medium pb-1">/ ${Number(product.price_usd)}</span>}
                 </div>
                 <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                   {product.in_stock ? (
                     <span className="flex items-center text-success bg-success/10 px-3 py-1 rounded-full"><CheckCircle2 size={16} className="mr-1.5" /> {product.stock_quantity ?? 1} in stock</span>
                   ) : (
                     <span className="flex items-center text-error bg-error/10 px-3 py-1 rounded-full"><XCircle size={16} className="mr-1.5" /> Currently Unavailable</span>
                   )}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-gray-100">
                 <a 
                   href={`https://wa.me/250783907794?text=Hello%20OrbitTech,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`flex-1 flex justify-center items-center gap-2 py-4 px-6 rounded-lg text-lg font-semibold transition-all shadow-sm ${product.in_stock ? 'bg-primary hover:bg-opacity-90 text-white hover:shadow-md hover:-translate-y-0.5' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                 >
                   {product.in_stock ? <><Send size={20} /> Request a Quote</> : 'Out of Stock'}
                 </a>
              </div>

              {/* Specifications Table */}
              <div>
                <h3 className="text-xl font-bold text-dark-slate mb-4">Specifications</h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                        <th className="py-3 px-4 font-semibold text-slate-700 w-1/3 bg-gray-100/50">Brand</th>
                        <td className="py-3 px-4 text-slate-600">{product.brand}</td>
                      </tr>
                      {specs.map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                          <th className="py-3 px-4 font-semibold text-slate-700 w-1/3 bg-gray-100/50">{key}</th>
                          <td className="py-3 px-4 text-slate-600">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
