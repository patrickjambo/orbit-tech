import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Package, Tag, AlertTriangle, Activity, ShoppingCart, Archive } from "lucide-react";
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  const [totalProducts, outOfStock, featured, recentProducts, aggregations] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { in_stock: false } }),
    db.product.count({ where: { featured: true } }),
    db.product.findMany({
      orderBy: { created_at: 'desc' },
      take: 5
    }),
    db.product.aggregate({
      _sum: {
        sold_quantity: true,
        stock_quantity: true
      }
    })
  ]);

  const totalSold = aggregations._sum.sold_quantity || 0;
  const totalStockLeft = aggregations._sum.stock_quantity || 0;

  const stats = [
    { title: 'Total Sold', value: totalSold, icon: <ShoppingCart className="w-8 h-8 text-success" />, color: 'bg-green-50' },
    { title: 'Items in Stock', value: totalStockLeft, icon: <Archive className="w-8 h-8 text-primary" />, color: 'bg-blue-50' },
    { title: 'Unique Products', value: totalProducts, icon: <Package className="w-8 h-8 text-purple-600" />, color: 'bg-purple-50' },
    { title: 'Out of Stock', value: outOfStock, icon: <AlertTriangle className="w-8 h-8 text-error" />, color: 'bg-red-50' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-slate">Dashboard Overview</h1>
        <Link href="/admin/products/new" className="bg-primary hover:bg-opacity-90 text-white px-5 py-2.5 rounded-md font-medium transition-colors">
          + Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className={`${stat.color} p-4 rounded-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-dark-slate">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark-slate flex items-center gap-2">
            <Activity className="text-slate-400" /> Recently Added Products
          </h2>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-gray-100">
            {recentProducts.map(product => (
              <li key={product.id} className="p-6 hover:bg-gray-50 flex items-center justify-between transition-colors">
                <div>
                  <h4 className="font-semibold text-dark-slate">{product.name}</h4>
                  <p className="text-sm text-slate-500 capitalize">{product.category} &bull; RWF {Number(product.price_rwf).toLocaleString()}</p>
                </div>
                <Link href={`/admin/products`} className="text-sm text-primary font-medium hover:underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
