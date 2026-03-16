import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Link from 'next/link';
import Image from "next/image";
import { ChevronLeft } from 'lucide-react';
import AdminRowActions from '@/components/admin/AdminRowActions';
import SellButton from '@/components/admin/SellButton';

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const products = await db.product.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-slate">Product Catalog</h1>
        <Link href="/admin/products/new" className="bg-primary hover:bg-opacity-90 text-white px-5 py-2.5 rounded-md font-medium transition-colors">
          + Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-slate-700">
              <tr>
                <th className="py-4 px-6 font-semibold border-b">Image</th>
                <th className="py-4 px-6 font-semibold border-b">Product Name</th>
                <th className="py-4 px-6 font-semibold border-b">Category</th>
                <th className="py-4 px-6 font-semibold border-b">Price (RWF)</th>
                <th className="py-4 px-6 font-semibold border-b">Stock</th>
                <th className="py-4 px-6 font-semibold border-b">Sold</th>
                <th className="py-4 px-6 font-semibold border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const images = (product.images as string[]) || [];
                return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 relative bg-white border rounded">
                       {images[0] ? (
                         <Image src={images[0]} alt={product.name} fill className="object-contain p-1" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-50">No Img</div>
                       )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-dark-slate">{product.name}</td>
                  <td className="py-4 px-6 text-slate-500 capitalize">{product.category}</td>
                  <td className="py-4 px-6 font-medium">{Number(product.price_rwf).toLocaleString()} RWF</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-700">{product.stock_quantity ?? 0} left</span>
                      {product.in_stock ? (
                        <span className="w-fit bg-success/10 text-success px-2 py-0.5 rounded-full text-[10px] font-bold">In Stock</span>
                      ) : (
                        <span className="w-fit bg-error/10 text-error px-2 py-0.5 rounded-full text-[10px] font-bold">Out of Stock</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-600">{product.sold_quantity ?? 0}</span>
                      <SellButton id={product.id} disabled={(product.stock_quantity ?? 0) <= 0} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                      <AdminRowActions id={product.id} stock={product.stock_quantity ?? 0} />
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
