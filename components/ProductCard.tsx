import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  images: string[];
  specifications: Record<string, string>;
  price_rwf: number;
  price_usd?: number;
  in_stock: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  // Grab a quick spec summary, e.g. "16GB, 1TB SSD"
  const specs = Object.values(product.specifications || {}).slice(0, 2).join(', ');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden group relative">
      <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center p-4">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
        
        {/* Status Badge */}
        {!product.in_stock && (
          <div className="absolute top-2 right-2 bg-error text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-dark-slate mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-1">{specs}</p>
        
        <div className="mt-auto">
          <p className="text-primary font-bold text-lg mb-4">
            RWF {product.price_rwf.toLocaleString()}
            {product.price_usd && <span className="text-sm text-slate-400 font-normal ml-2">(${product.price_usd})</span>}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="block text-center w-full bg-light-blue text-primary hover:bg-primary hover:text-white font-medium py-2 rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
