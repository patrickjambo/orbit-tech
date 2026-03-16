import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from '@/lib/db';
// fs and path removed due to read-only Vercel environment
import { revalidatePath } from 'next/cache';

async function saveBase64Images(images: string[] | undefined) {
  if (!images || images.length === 0) return [];
  const saved: string[] = [];
  for (const img of images) {
    if (typeof img !== 'string') continue;
    // On Vercel, the filesystem is read-only. 
    // Without AWS S3 or Cloudinary, the most robust immediate solution 
    // is to store the actual Base64 Data URL directly into the Neon Database JSON.
    saved.push(img);
  }
  return saved;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Process specifications array into object
    const specObj: Record<string, string> = {};
    if (data.specifications && Array.isArray(data.specifications)) {
      data.specifications.forEach((spec: {key: string, value: string}) => {
        if (spec.key && spec.value) {
          specObj[spec.key] = spec.value;
        }
      });
    }

    // Save base64 images (if any) to public/uploads and get URLs
    const savedImages = await saveBase64Images(data.images);

    const product = await db.product.create({
      data: {
        name: data.name,
        category: data.category,
        brand: data.brand,
        sku: data.sku || null,
        description: data.description,
        price_rwf: data.price_rwf,
        price_usd: data.price_usd || null,
        stock_quantity: data.stock_quantity || 0,
        in_stock: (data.stock_quantity || 0) > 0,
        featured: data.featured,
        specifications: specObj,
        images: savedImages
      }
    });

    revalidatePath('/', 'layout'); // Purge entire site cache on product changes

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
