import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../../../auth';
import { fetchFromBackend } from '../../../../lib/api';
import MasterAdminConsoleClient from './MasterAdminConsoleClient';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default async function MasterAdminManagePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/admin/login');
  }

  const user = session.user as any;
  if (user.role !== 'superadmin') {
    redirect('/admin/dashboard');
  }

  let forms: any[] = [];
  let regulations: any[] = [];
  let units: any[] = [];
  let labs: any[] = [];
  let events: any[] = [];

  try {
    const [formsData, regsData, unitsData, labsData, eventsData] = await Promise.all([
      fetchFromBackend<any[]>('/api/forms?includeDraft=true', {}, []),
      fetchFromBackend<any[]>('/api/regulations?includeDraft=true', {}, []),
      fetchFromBackend<any[]>('/api/units?includeDraft=true', {}, []),
      fetchFromBackend<any[]>('/api/labs?includeDraft=true', {}, []),
      fetchFromBackend<any[]>('/api/events?includeDraft=true', {}, [])
    ]);
    forms = formsData;
    regulations = regsData;
    units = unitsData;
    labs = labsData;
    events = eventsData;
  } catch (err) {
    console.error('Failed to load master admin datasets:', err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/admin/dashboard" 
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[var(--primary-maroon)] flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-extrabold text-[var(--primary-maroon)] uppercase tracking-wider block">
                Master Admin Portal
              </span>
              <h1 className="text-2xl font-extrabold text-[var(--secondary-blue)]">
                SURC Master Governance & Structure Console
              </h1>
            </div>
          </div>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-[var(--primary-maroon)]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Master Admin Level</span>
          </span>
        </div>

        {/* Client Interactive Component */}
        <MasterAdminConsoleClient 
          initialForms={forms} 
          initialRegulations={regulations}
          initialUnits={units}
          initialLabs={labs}
          initialEvents={events}
        />

      </div>
    </div>
  );
}
