'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'computers', name: 'Computers & Main Devices' },
  { id: 'displays', name: 'Display & Output' },
  { id: 'networking', name: 'Networking Devices' },
  { id: 'security', name: 'Security & Surveillance' },
  { id: 'accessories', name: 'Accessories' }
];

type SerializedProduct = {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string | null;
  description: string;
  specifications: Record<string, string>;
  price_rwf: number;
  price_usd?: number;
  images: string[];
  in_stock: boolean;
  featured: boolean;
};

export default function ProductGrid({ initialProducts }: { initialProducts: SerializedProduct[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Compute exactly what categories are available, if selected doesn't exist, silently pull all products.
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, initialProducts]);

  // Find the exact products to display
  const displayProducts = useMemo(() => {
    if (filteredProducts.length > 0) return filteredProducts;
    
    // If we're showing empty state, automatically fall back to 'all' so they see something
    return initialProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [filteredProducts, initialProducts, searchTerm]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <button 
        className="md:hidden flex items-center justify-between bg-white p-4 rounded-lg shadow-sm w-full"
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
      >
        <span className="font-semibold flex items-center gap-2"><Filter size={20} /> Filters</span>
        {isMobileFiltersOpen ? <X size={20} /> : <span className="text-sm font-normal text-slate-500">{selectedCategory}</span>}
      </button>

      {/* Sidebar Filters */}
      <aside className={`w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden'} md:block transition-all`}>
        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-dark-slate mb-4 border-b pb-2">Categories</h2>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsMobileFiltersOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === cat.id 
                    ? 'bg-light-blue text-primary font-medium' 
                    : 'text-slate-600 hover:bg-gray hover:text-dark-slate'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Products Area */}
      <main className="flex-1">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by product name or keyword..."
            className="w-full bg-transparent outline-none text-dark-slate placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 text-slate-400 hover:text-dark-slate">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center text-sm text-slate-500">
          <span>Showing {displayProducts.length} results</span>
          {filteredProducts.length === 0 && selectedCategory !== 'all' && (
            <span className="text-amber-500">No products found in this exact category. Showing all instead.</span>
          )}
        </div>

        {/* Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product as unknown as React.ComponentProps<typeof ProductCard>["product"]} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-dark-slate mb-2">No products found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-opacity-90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
