import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from '@/lib/db';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const exportRange = searchParams.get('exportRange');

    if (exportRange) {
      // Export mode
      let startDate = new Date(0);
      const now = new Date();
      if (exportRange === 'day') startDate = startOfDay(now);
      else if (exportRange === 'week') startDate = startOfWeek(now);
      else if (exportRange === 'month') startDate = startOfMonth(now);
      else if (exportRange === 'year') startDate = startOfYear(now);

      const sales = await db.saleEvent.findMany({
        where: { created_at: { gte: startDate } },
        include: { product: true },
        orderBy: { created_at: 'desc' }
      });
      return NextResponse.json({ sales });
    }

    // Dashboard standard data
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
      db.product.findMany({ select: { stock_quantity: true, price_rwf: true } }), // to calculate total stock value
      db.saleEvent.aggregate({ where: { created_at: { gte: today } }, _sum: { price_rwf: true } }),
      db.saleEvent.aggregate({ _sum: { price_rwf: true } }),
      db.product.findMany({ orderBy: { created_at: 'desc' }, take: 6 }),
      db.saleEvent.findMany({ include: { product: true }, orderBy: { created_at: 'desc' }, take: 6 })
    ]);

    const itemsLeft = totalSoldAggr._sum.stock_quantity || 0;
    const itemsSold = totalSoldAggr._sum.sold_quantity || 0;
    
    let totalStockValue = 0;
    stockValueAggr.forEach(p => {
      totalStockValue += p.stock_quantity * Number(p.price_rwf);
    });

    const todaysRevenue = Number(todaysSalesAggr._sum.price_rwf) || 0;
    const totalRevenue = Number(totalSalesAggr._sum.price_rwf) || 0;

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
