import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
// fs and path removed to support serverless environment
import { revalidatePath } from 'next/cache';

async function saveBase64Images(images: string[] | undefined) {
  if (!images || images.length === 0) return [];
  const saved: string[] = [];
  for (const img of images) {
    if (typeof img !== 'string') continue;
    // On Vercel, the filesystem is read-only. We save the Base64 Data URL directly to PostgreSQL.
    saved.push(img);
  }
  return saved;
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const id = params.id;
    const body = await req.json();

    // convert specifications
    const specObj: Record<string, string> = {};
    if (body.specifications && Array.isArray(body.specifications)) {
      body.specifications.forEach((s: {key:string, value:string}) => { if (s.key) specObj[s.key] = s.value; });
    }

    // save any new images and collect final image list
    const newSaved = await saveBase64Images(body.images);

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // remove images flagged for deletion
    if (Array.isArray(body.removeImages) && body.removeImages.length) {
      // In a real cloud setup, you would delete them from Cloudinary/S3 here.
      // Since we just save base64 directly to the DB, they will simply be overwritten.
    }

  const existingImages = Array.isArray(existing.images) ? (existing.images as string[]) : [];
  const retained = existingImages.filter((u: string) => !(Array.isArray(body.removeImages) && body.removeImages.includes(u)));
  const finalImages = retained.concat(newSaved);

    const updated = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        brand: body.brand,
        sku: body.sku || null,
        description: body.description,
        price_rwf: body.price_rwf,
        price_usd: body.price_usd || null,
        stock_quantity: body.stock_quantity || 0,
        in_stock: (body.stock_quantity || 0) > 0,
        featured: body.featured,
        specifications: specObj,
        images: finalImages,
      }
    });

    revalidatePath('/', 'layout'); // Purge caches heavily on mutation

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await props.params;
    const id = params.id;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // delete images
    if (Array.isArray(existing.images)) {
      // Similarly, if you used a cloud provider, send delete requests here.
    }

    await db.product.delete({ where: { id } });
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
