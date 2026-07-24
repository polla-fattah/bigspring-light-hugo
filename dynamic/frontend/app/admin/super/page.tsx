import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../../auth';
import { fetchFromBackend } from '../../../lib/api';
import { Shield, ShieldAlert, ArrowLeft } from 'lucide-react';
import SuperadminConsoleForm from '../../../components/SuperadminConsoleForm';

// Fetch functions
async function getSettings(): Promise<Record<string, string>> {
  try {
    return await fetchFromBackend<Record<string, string>>('/api/settings');
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function getUsers(): Promise<any[]> {
  try {
    return await fetchFromBackend<any[]>('/api/users');
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getDrafts(): Promise<any[]> {
  try {
    return await fetchFromBackend<any[]>('/api/content/publish');
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function SuperadminSettingsPage() {
  const session = await auth();

  // Guard: Not logged in
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  const user = session.user as any;

  // Guard: Not superadmin
  if (user.role !== 'superadmin') {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-650 mx-auto" />
          <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">Access Denied</h2>
          <p className="text-xs text-slate-500">You do not have the required superadmin privileges to access this console.</p>
          <Link href="/admin/dashboard" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fetch initial dashboard payloads
  const [settings, users, drafts] = await Promise.all([
    getSettings(),
    getUsers(),
    getDrafts()
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link href="/admin/dashboard" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Dashboard Title Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-2">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--primary-maroon)] uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Superadmin System Console</span>
          </span>
          <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Administrative Settings & Verification Control
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Manage system configurations, adjust researcher permissions, promote users, and verify pending queues.
          </p>
        </div>

        {/* Tabbed dashboard content */}
        <SuperadminConsoleForm 
          initialSettings={settings}
          initialUsers={users}
          initialDrafts={drafts}
        />

      </div>
    </div>
  );
}
