import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center text-slate-500 hover:text-primary font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark-slate">Add New Product</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <ProductForm />
      </div>
    </div>
  );
}
