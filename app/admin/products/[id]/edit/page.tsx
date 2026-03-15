import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) return redirect('/admin/login');

  const product = await db.product.findUnique({ where: { id: params.id } });
  if (!product) return redirect('/admin/products');

  // serialize product to plain object (remove Date instances)
  const initialData = {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    sku: product.sku,
    description: product.description,
    price_rwf: product.price_rwf,
    price_usd: product.price_usd,
    stock_quantity: product.stock_quantity,
    in_stock: product.in_stock,
    featured: product.featured,
    images: Array.isArray(product.images) ? product.images : [],
    specifications: typeof product.specifications === 'object' && product.specifications ? product.specifications : undefined,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      {/* ProductForm is a client component and accepts initialData */}
      <ProductForm initialData={initialData} />
    </div>
  );
}
