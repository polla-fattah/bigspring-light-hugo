'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Landmark, Lock, Mail, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password.');
      } else {
        // Successful login, redirect to admin dashboard
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[var(--primary-maroon)] opacity-[0.03] blur-3xl"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[60%] rounded-full bg-[var(--secondary-blue)] opacity-[0.03] blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10 relative">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl space-y-6">
          
          {/* SUE Institutional Branding Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Salahaddin University-Erbil Logo" 
                className="h-16 w-auto object-contain drop-shadow-md" 
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
                Salahaddin University-Erbil
              </h2>
              <p className="text-xs font-bold text-[var(--primary-maroon)] uppercase tracking-widest">
                Research Center Portal
              </p>
            </div>
            <div className="h-0.5 w-16 bg-[var(--accent-gold)] mx-auto rounded-full mt-3"></div>
          </div>

          {/* Error Alert Display */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Institutional Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all"
                  placeholder="e.g. researcher@su.edu.krd"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Portal Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-maroon)] transition-all cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign In to Portal</span>
                )}
              </button>
            </div>
          </form>

          {/* Admin & Researcher Registration CTA Footer */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <p className="text-xs text-slate-600 font-semibold mb-1">
                Don't have an SURC account yet?
              </p>
              <Link 
                href="/admin/register" 
                className="inline-flex items-center space-x-1 font-extrabold text-xs text-[var(--primary-maroon)] hover:underline"
              >
                <span>Register with your @su.edu.krd email →</span>
              </Link>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              Default password for initial demo accounts: <span className="text-[var(--primary-maroon)] font-bold">password123</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
