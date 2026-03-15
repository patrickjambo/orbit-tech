"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

export default function SellButton({ id, disabled }: { id: string, disabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSell = async () => {
    if (!confirm('Mark 1 item as sold?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}/sell`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to mark as sold');
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Error updating stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSell}
      disabled={disabled || loading}
      title="Mark 1 unit as sold"
      className={`p-1.5 rounded-md flex items-center justify-center transition-colors 
        ${disabled 
          ? 'text-slate-300 cursor-not-allowed' 
          : loading 
            ? 'text-primary animate-pulse' 
            : 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-100'}`}
    >
      <ShoppingCart size={16} />
    </button>
  );
}
