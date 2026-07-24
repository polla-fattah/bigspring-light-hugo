import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../../auth';
import { fetchFromBackend } from '../../../lib/api';
import { ArrowLeft, UserCheck, ShieldAlert } from 'lucide-react';
import ResearcherProfileForm from '../../../components/ResearcherProfileForm';

interface StaffDetail {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  titlePosition: string | null;
  email: string | null;
  orcid: string | null;
  googleScholar: string | null;
  scopus: string | null;
  researchgate: string | null;
  personalWebsite: string | null;
  bio: string | null;
  description: string | null;
  researchAreas: string[];
}

export default async function ResearcherProfilePage() {
  const session = await auth();

  // Guard: Not logged in
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  const user = session.user as any;
  const staffId = user.staffId;

  // Guard: Logged in user has no associated Staff ID profile
  if (!staffId) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-[var(--accent-gold)] mx-auto animate-pulse-soft" />
          <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">No Linked Profile</h2>
          <p className="text-xs text-slate-500">
            Your user account ({user.email}) is not linked to a researcher profile in our PostgreSQL database. Only registered academic staff can customize details.
          </p>
          <Link href="/admin/dashboard" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  let staff: StaffDetail | null = null;
  let errorMsg = '';

  try {
    staff = await fetchFromBackend<StaffDetail>(`/api/staff/${staffId}`);
  } catch (error) {
    errorMsg = 'Could not load researcher profile details from database.';
  }

  if (errorMsg || !staff) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-650 font-bold">{errorMsg || 'Researcher profile not found.'}</p>
          <Link href="/admin/dashboard" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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
            <UserCheck className="w-4 h-4" />
            <span>Profile Customization</span>
          </span>
          <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Manage Public Profile Details
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Customize your academic bio, research areas, and indices. Changes update dynamically on your public profile directory details.
          </p>
        </div>

        {/* Form container */}
        <ResearcherProfileForm staff={staff} />

      </div>
    </div>
  );
}
