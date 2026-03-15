'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-error/20 hover:text-error transition-colors mt-8"
    >
      <LogOut size={20} /> Sign Out
    </button>
  );
}
