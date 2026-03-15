export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Package } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray flex flex-col md:flex-row">
      {session ? (
        <>
          <aside className="w-full md:w-64 bg-slate-900 text-white md:min-h-screen flex-shrink-0">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold">OrbitTech Control</h2>
              <p className="text-sm text-slate-400 mt-1">Logged in as {session.user?.name}</p>
            </div>
            <nav className="p-4 space-y-2">
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-primary transition-colors">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Package size={20} /> Products
              </Link>
              <LogoutButton />
            </nav>
          </aside>
          <main className="flex-1 p-8">
            {children}
          </main>
        </>
      ) : (
        <main className="flex-1 w-full">
          {children}
        </main>
      )}
    </div>
  );
}
