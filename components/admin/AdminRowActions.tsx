"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Edit, Trash2, CheckSquare } from 'lucide-react';

export default function AdminRowActions({ id, stock }: { id: string, stock?: number }) {
  const router = useRouter();
  const [selling, setSelling] = useState(false);

  const onSell = async () => {
    if (stock && stock <= 0) {
      alert("Out of stock!");
      return;
    }
    setSelling(true);
    try {
      const res = await fetch(`/api/admin/products/${id}/sell`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to sell');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to mark as sold.');
    } finally {
      setSelling(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      // Refresh the admin listing
      router.refresh();
      alert('Product deleted');
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <button 
        onClick={onSell} 
        disabled={selling || (stock !== undefined && stock <= 0)}
        className={`text-slate-400 hover:text-success title="Mark 1 Sold" ${selling || (stock !== undefined && stock <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Mark 1 Sold"
      >
        <CheckSquare size={18} />
      </button>
      <Link href={`/products/${id}`} target="_blank" className="text-slate-400 hover:text-accent" title="View on site">
        <ExternalLink size={18} />
      </Link>
      <Link href={`/admin/products/${id}/edit`} className="text-slate-400 hover:text-primary" title="Edit">
        <Edit size={18} />
      </Link>
      <button onClick={onDelete} className="text-slate-400 hover:text-error" title="Delete">
        <Trash2 size={18} />
      </button>
    </div>
  );
}
