'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-dark-slate">
            Staff Login
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Access the inventory management system
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-error/10 text-error p-3 rounded text-sm text-center font-medium">{error}</div>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="text-sm font-medium text-slate-700 block mb-1">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow outline-none" 
                placeholder="Shemaclaude2021@gmail.com" 
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700 block mb-1">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow outline-none" 
                placeholder="shema@123?" 
              />
            </div>
          </div>
          <div>
            <button 
              type="submit" 
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90 hover:shadow-md'}`}
            >
              {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
            </button>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-400">
                Authorized access only.
              </p>
              <a href="/admin/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
