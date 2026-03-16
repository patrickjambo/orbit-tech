'use client';

import { useState, useEffect } from 'react';
import { Package, Tag, AlertTriangle, Activity, ShoppingCart, Archive, DollarSign, Download, FileText, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

type DashboardData = {
  stats: {
    todaysRevenue: number;
    totalRevenue: number;
    itemsLeft: number;
    totalStockValue: number;
    itemsSold: number;
    lowStockCount: number;
    totalProductsCount: number;
  };
  recentlyAdded: any[];
  recentSales: any[];
};

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const fetchData = async () => {
    try {
      // setIsRefreshing(true);
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      // setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Refresh every 10 seconds silently
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async (formatType: 'pdf' | 'excel', range: string) => {
    setExportMenuOpen(false);
    try {
      const res = await fetch(`/api/admin/dashboard?exportRange=${range}`);
      const { sales } = await res.json();

      if (!sales || sales.length === 0) {
        alert("No sales data found for the selected period.");
        return;
      }

      const tableData = sales.map((sale: any) => [
        format(new Date(sale.created_at), 'yyyy-MM-dd HH:mm'),
        sale.product?.name || 'Unknown Product',
        sale.quantity,
        `RWF ${Number(sale.price_rwf).toLocaleString()}`,
        `RWF ${(sale.quantity * Number(sale.price_rwf)).toLocaleString()}`
      ]);

      const headers = ['Date', 'Product', 'Quantity', 'Unit Price', 'Total'];

      if (formatType === 'pdf') {
        const doc = new jsPDF();
        doc.text(`Sales Report - ${range.toUpperCase()}`, 14, 15);
        
        (doc as any).autoTable({
          startY: 20,
          head: [headers],
          body: tableData,
        });

        doc.save(`OrbitTech-Sales-${range}.pdf`);
      } else {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...tableData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales");
        XLSX.writeFile(wb, `OrbitTech-Sales-${range}.xlsx`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate export');
    }
  };

  const cards = [
    { title: "Today's Revenue", value: `RWF ${data.stats.todaysRevenue.toLocaleString()}`, icon: <DollarSign className="w-8 h-8 text-green-600" />, bg: "bg-green-50", text: "text-green-600" },
    { title: "Total Revenue", value: `RWF ${data.stats.totalRevenue.toLocaleString()}`, icon: <Activity className="w-8 h-8 text-blue-600" />, bg: "bg-blue-50", text: "text-blue-600" },
    { title: "Total Items Sold", value: data.stats.itemsSold.toLocaleString(), icon: <ShoppingCart className="w-8 h-8 text-indigo-600" />, bg: "bg-indigo-50", text: "text-indigo-600" },
    { title: "Items in Stock (Total)", value: data.stats.itemsLeft.toLocaleString(), icon: <Archive className="w-8 h-8 text-cyan-600" />, bg: "bg-cyan-50", text: "text-cyan-600" },
    { title: "Low Stock Alerts", value: data.stats.lowStockCount.toString(), icon: <AlertTriangle className="w-8 h-8 text-red-600" />, bg: "bg-red-50", text: "text-red-500" },
    { title: "Total Unique Products", value: data.stats.totalProductsCount.toString(), icon: <Package className="w-8 h-8 text-purple-600" />, bg: "bg-purple-50", text: "text-purple-600" },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-slate flex items-center gap-3">
            Dashboard Overview
            {isRefreshing && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Live Sync Active"></span>}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Real-time store metrics and stock alerts</p>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="bg-white border border-gray-200 text-dark-slate hover:bg-gray-50 px-4 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <Download size={18} /> Export Reports
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-lg rounded-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-50 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-gray-50/50">PDF Export</div>
                {[
                  { label: "Today's Sales", val: 'day' },
                  { label: "This Week", val: 'week' },
                  { label: "This Month", val: 'month' },
                  { label: "Annual Report", val: 'year' },
                ].map(item => (
                  <button key={`pdf-${item.val}`} onClick={() => handleExport('pdf', item.val)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-light-blue hover:text-primary flex items-center gap-2 transition-colors">
                    <FileText size={14} /> {item.label}
                  </button>
                ))}
                
                <div className="p-3 border-b border-t border-gray-50 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-gray-50/50">Excel Export</div>
                {[
                  { label: "Today's Sales", val: 'day' },
                  { label: "This Week", val: 'week' },
                  { label: "This Month", val: 'month' },
                  { label: "Annual Report", val: 'year' },
                ].map(item => (
                  <button key={`xls-${item.val}`} onClick={() => handleExport('excel', item.val)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-light-blue hover:text-primary flex items-center gap-2 transition-colors">
                    <FileSpreadsheet size={14} /> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/admin/products/new" className="bg-primary hover:bg-opacity-90 text-white px-5 py-2.5 rounded-md font-medium transition-colors shadow-sm whitespace-nowrap">
            + Add Product
          </Link>
        </div>
      </div>

      {/* 6 Real-time Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
            {stat.title === 'Low Stock Alerts' && data.stats.lowStockCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse"></span>
            )}
            <div className={`${stat.bg} p-4 rounded-xl flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className={`text-2xl lg:text-3xl font-bold ${stat.text}`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panel 1: Recently Added */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
            <h2 className="text-lg font-bold text-dark-slate flex items-center gap-2">
              <Package className="text-primary" size={20} /> Recently Added Inventory
            </h2>
            <Link href="/admin/products" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {data.recentlyAdded.length === 0 ? (
              <p className="p-6 text-slate-500 text-center">No products found.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentlyAdded.map((product) => (
                  <li key={product.id} className="p-5 hover:bg-gray-50 flex items-center justify-between transition-colors">
                    <div>
                      <h4 className="font-semibold text-dark-slate text-sm line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 capitalize">{product.category} &bull; Stock: {product.stock_quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-dark-slate">RWF {Number(product.price_rwf).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Panel 2: Recent Sold */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
            <h2 className="text-lg font-bold text-dark-slate flex items-center gap-2">
              <Activity className="text-green-600" size={20} /> Today's Recent Sales
            </h2>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {data.recentSales.length === 0 ? (
              <p className="p-6 text-slate-500 text-center">No recent sales data.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentSales.map((sale) => (
                  <li key={sale.id} className="p-5 hover:bg-gray-50 flex items-center justify-between transition-colors">
                    <div>
                      <h4 className="font-semibold text-dark-slate text-sm line-clamp-1">{sale.product?.name || "Deleted Product"}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(sale.created_at), 'h:mm a')} &bull; Qty: {sale.quantity}
                      </p>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-sm font-bold text-green-600">+ RWF {(sale.quantity * Number(sale.price_rwf)).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
