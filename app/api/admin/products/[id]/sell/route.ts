import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const id = params.id;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (existing.stock_quantity <= 0) {
        return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
    }

    const updated = await db.$transaction(async (prisma) => {
      // Create the sale event to track revenue and history
      await prisma.saleEvent.create({
        data: {
          productId: existing.id,
          quantity: 1,
          price_rwf: existing.price_rwf
        }
      });

      // Update product inventory and sold counters
      return await prisma.product.update({
        where: { id },
        data: {
          stock_quantity: existing.stock_quantity - 1,
          sold_quantity: existing.sold_quantity + 1,
          in_stock: existing.stock_quantity - 1 > 0
        }
      });
    });

    revalidatePath('/', 'layout');

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
