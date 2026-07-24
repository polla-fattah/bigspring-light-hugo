import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldAlert } from 'lucide-react';
import { auth } from '../../../../auth';
import { fetchFromBackend } from '../../../../lib/api';
import PublicationSubmitForm from './PublicationSubmitForm';

interface Unit {
  id: string;
  title: string;
}

export default async function SubmitPublicationPage() {
  const session = await auth();

  // Guard routing
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  const user = session.user as any;
  if (!user.staffId) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-655 mx-auto" />
          <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">Account Not Linked</h2>
          <p className="text-xs text-slate-500">Your user account is not linked to any academic researcher profile. Only verified researchers can propose publication records.</p>
          <Link href="/admin/dashboard" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let units: Unit[] = [];
  try {
    units = await fetchFromBackend<Unit[]>('/api/units');
  } catch (error) {
    console.error('Failed to prefetch research units for form:', error);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Navigation back */}
        <div>
          <Link href="/admin/dashboard" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-2">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--primary-maroon)] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Proposal Registry</span>
          </span>
          <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Submit Publication Proposal
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Register a research article, thesis, or academic report. Your draft will be queued for review and verification before cataloging.
          </p>
        </div>

        {/* Client Form Component */}
        <PublicationSubmitForm units={units} staffId={user.staffId} />

      </div>
    </div>
  );
}
