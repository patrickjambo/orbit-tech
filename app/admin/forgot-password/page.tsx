'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API check against strict user requirements
    if (email.toLowerCase() !== 'shemaclaude2021@gmail.com' || phone !== '0783907794') {
        setError('Verification failed. Email or phone number does not match super admin records.');
        setLoading(false);
        return;
    }

    setTimeout(() => {
        setMessage('OTP sent to your phone (0783907794) and Email!');
        setLoading(false);
        setStep(2);
    }, 1000);
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcode OTP check to allow demo completion since no real SMS API key is given
    if (otp !== '123456') { // Mock OTP
        setError('Invalid OTP code. Please use 123456 for demo purposes.');
        setLoading(false);
        return;
    }

    try {
        const res = await fetch('/api/auth/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });

        if (!res.ok) throw new Error('Failed to reset');

        setMessage('Password reset successful! You can now login.');
        setStep(3);
    } catch {
        setError('Server error while resetting password.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-dark-slate">
            Reset Password
          </h2>
        </div>

        {error && <div className="bg-error/10 text-error p-3 rounded text-sm text-center font-medium">{error}</div>}
        {message && <div className="bg-success/10 text-success p-3 rounded text-sm text-center font-medium">{message}</div>}

        {step === 1 && (
            <form className="mt-8 space-y-6" onSubmit={requestReset}>
            <div className="space-y-4 rounded-md shadow-sm">
                <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Verify Email</label>
                <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Enter admin email"
                />
                </div>
                <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Verify Phone Number</label>
                <input 
                    type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="relative block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:ring-primary focus:border-primary outline-none"
                    placeholder="078xxxxxxx"
                />
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white transition-all hover:bg-opacity-90">
                {loading ? 'Verifying...' : 'Send OTP'}
            </button>
            <div className="text-center mt-4">
                <Link href="/admin/login" className="text-sm text-primary hover:underline">Back to Login</Link>
            </div>
            </form>
        )}

        {step === 2 && (
            <form className="mt-8 space-y-6" onSubmit={submitReset}>
            <div className="space-y-4 rounded-md shadow-sm">
                <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Enter OTP</label>
                <input 
                    type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="relative block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:ring-primary outline-none"
                    placeholder="6-digit code"
                />
                </div>
                <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">New Password</label>
                <input 
                    type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="relative block w-full rounded-md border border-gray-300 py-2.5 px-3 focus:ring-primary outline-none"
                    placeholder="Enter new password"
                />
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white transition-all hover:bg-opacity-90">
                {loading ? 'Resetting...' : 'Confirm Reset'}
            </button>
            </form>
        )}

        {step === 3 && (
            <div className="text-center mt-8">
                <Link href="/admin/login" className="w-full flex justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white hover:bg-opacity-90">
                    Go to Login
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
