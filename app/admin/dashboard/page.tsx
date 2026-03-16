import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import DashboardClient from "@/components/admin/DashboardClient";
import { startOfDay } from 'date-fns';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  // Same logic as API to get initial SSR data
  const today = startOfDay(new Date());

  const [
    totalProductsCount,
    lowStockCount,
    totalSoldAggr,
    stockValueAggr,
    todaysSalesAggr,
    totalSalesAggr,
    recentlyAdded,
    recentSales
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { stock_quantity: { lte: 5 } } }),
    db.product.aggregate({ _sum: { sold_quantity: true, stock_quantity: true } }),
    db.product.findMany({ select: { stock_quantity: true, price_rwf: true } }),
    db.saleEvent.aggregate({ where: { created_at: { gte: today } }, _sum: { price_rwf: true } }),
    db.saleEvent.aggregate({ _sum: { price_rwf: true } }),
    db.product.findMany({ orderBy: { created_at: 'desc' }, take: 6 }),
    db.saleEvent.findMany({ include: { product: true }, orderBy: { created_at: 'desc' }, take: 6 })
  ]);

  const itemsLeft = totalSoldAggr._sum.stock_quantity || 0;
  const itemsSold = totalSoldAggr._sum.sold_quantity || 0;
  
  let totalStockValue = 0;
  stockValueAggr.forEach((p: any) => {
    totalStockValue += p.stock_quantity * Number(p.price_rwf);
  });

  const todaysRevenue = Number(todaysSalesAggr._sum.price_rwf) || 0;
  const totalRevenue = Number(totalSalesAggr._sum.price_rwf) || 0;

  // Serialize exactly as JSON to avoid 'Decimal' object error across boundaries Server->Client Data
  const initialData = JSON.parse(JSON.stringify({
    stats: {
      todaysRevenue,
      totalRevenue,
      itemsLeft,
      totalStockValue,
      itemsSold,
      lowStockCount,
      totalProductsCount
    },
    recentlyAdded,
    recentSales
  }));

  return <DashboardClient initialData={initialData} />;
}
