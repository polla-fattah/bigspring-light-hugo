'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  GraduationCap,
  KeyRound,
  Inbox,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Step 1 vs Step 2 state
  const [step, setStep] = useState<1 | 2>(1);

  // Form Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');

  // Form Step 2 (Verification)
  const [generatedCode, setGeneratedCode] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validate if email ends with su.edu.krd
  const isSueEmailValid = useMemo(() => {
    if (!email.trim()) return null;
    return email.toLowerCase().trim().endsWith('su.edu.krd');
  }, [email]);

  // Handle Step 1 Submission -> Generate Code & Move to Step 2
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isSueEmailValid) {
      setError('Registration is strictly reserved for Salahaddin University email addresses ending with su.edu.krd.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          role
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to register account.');
        setLoading(false);
        return;
      }

      // Code generated successfully
      setGeneratedCode(data.verificationCode || '123456');
      setStep(2);
      setSuccessMsg(`Verification security code dispatched to ${email.toLowerCase().trim()}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Digit Input Box Changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fillQuickCode = () => {
    if (!generatedCode || generatedCode.length !== 6) return;
    setOtp(generatedCode.split(''));
  };

  // Handle Step 2 Submission -> Verify Code & Auto Login
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${backendUrl}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          code: fullCode
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Invalid verification code.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Email verified! Activating your account...');

      // Auto Login
      const signInRes = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/admin/login?verified=true');
      } else {
        router.push('/labs');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify security code.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-block">
          <img src="/logo.png" alt="SURC Logo" className="h-16 w-auto mx-auto drop-shadow-md" />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {step === 1 ? 'Create SUE Researcher Account' : 'Verify SUE Email Address'}
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {step === 1 
            ? 'Salahaddin University-Erbil Research Center Portal Registration'
            : `Enter the 6-digit security code sent to ${email}`}
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100/20">
          
          {step === 1 ? (
            /* STEP 1: REGISTRATION FORM */
            <form className="space-y-5" onSubmit={handleStep1Submit}>
              
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start space-x-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Polla Fattah"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)]"
                  />
                </div>
              </div>

              {/* SUE Email Field with Domain Validation Badge */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    SUE University Email
                  </label>
                  <span className="text-[10px] font-bold text-[var(--accent-gold)]">
                    @*.su.edu.krd Only
                  </span>
                </div>

                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. polla.fattah@su.edu.krd"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      isSueEmailValid === true
                        ? 'border-green-400 focus:ring-green-500 bg-green-50/20'
                        : isSueEmailValid === false
                        ? 'border-red-300 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-200 focus:ring-[var(--primary-maroon)]'
                    }`}
                  />
                </div>

                {isSueEmailValid === true && (
                  <div className="mt-1.5 text-[10px] font-bold text-green-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>Verified Salahaddin University Email Domain</span>
                  </div>
                )}
                {isSueEmailValid === false && (
                  <div className="mt-1.5 text-[10px] font-bold text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    <span>Must end with su.edu.krd (e.g. user@su.edu.krd or user@student.su.edu.krd)</span>
                  </div>
                )}
              </div>

              {/* Academic Role */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Affiliation
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)]"
                  >
                    <option value="student">Postgraduate Researcher / Student</option>
                    <option value="faculty">Academic Faculty Staff / Professor</option>
                    <option value="researcher">Visiting Researcher / Scholar</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isSueEmailValid === false}
                className="w-full sue-btn-primary py-3.5 rounded-xl font-extrabold text-xs flex justify-center items-center space-x-2 shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Email Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* STEP 2: 6-DIGIT EMAIL VERIFICATION SCREEN */
            <form className="space-y-6" onSubmit={handleStep2Submit}>
              
              {/* SUE Webmail Intercept Notice (Simulated Email Dispatch without SMTP Server) */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-extrabold">
                  <Inbox className="w-4 h-4 text-amber-700" />
                  <span>SUE Webmail Dispatch Intercept Notice:</span>
                </div>
                <p className="text-amber-800 leading-relaxed font-medium">
                  A verification email has been dispatched to <strong>{email}</strong>.
                </p>
                <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                  <span className="font-bold text-amber-950">Security Code: <code className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-mono text-sm tracking-widest">{generatedCode}</code></span>
                  <button
                    type="button"
                    onClick={fillQuickCode}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-600 text-white hover:bg-amber-700 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto Fill</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 6 Individual Digit Inputs */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider text-center mb-3">
                  Enter 6-Digit Security Code
                </label>
                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-13 text-center text-lg font-extrabold text-slate-900 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all font-mono"
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full sue-btn-primary py-3.5 rounded-xl font-extrabold text-xs flex justify-center items-center space-x-2 shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Security Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify & Activate SUE Account</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  ← Back to Email & Registration Details
                </button>
              </div>

            </form>
          )}

          {/* Login Redirection Footer */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Already registered with your SUE email?{' '}
              <Link href="/admin/login" className="font-extrabold text-[var(--primary-maroon)] hover:underline">
                Sign in to your account →
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
