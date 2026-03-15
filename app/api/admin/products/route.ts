import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const b64 = match[2];
  const buffer = Buffer.from(b64, 'base64');
  return { buffer, mime };
}

async function saveBase64Images(images: string[] | undefined) {
  if (!images || images.length === 0) return [];
  const outDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(outDir, { recursive: true });
  const saved: string[] = [];
  for (const img of images) {
    if (typeof img !== 'string') continue;
    // If already a remote or local URL, keep as-is
    if (img.startsWith('http') || img.startsWith('/uploads/')) {
      saved.push(img);
      continue;
    }
    const parsed = dataUrlToBuffer(img);
    if (!parsed) continue;
    const ext = parsed.mime.split('/')[1] || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
    const filePath = path.join(outDir, fileName);
    await fs.writeFile(filePath, parsed.buffer);
    saved.push(`/uploads/${fileName}`);
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
