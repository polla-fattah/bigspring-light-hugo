import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../../../auth';
import { Settings, Clock, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import ReservationModerationRow from '../../../components/ReservationModerationRow';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchReservations(): Promise<any[]> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/labs/reservations`, {
      cache: 'no-store', // Always fetch fresh
    });
    if (!res.ok) throw new Error('Failed to load reservations.');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function LabSupervisorConsolePage() {
  const session = await auth();

  // Route guarding: only allow superadmin or lab_staff
  if (!session || !session.user) {
    redirect('/admin/login');
  }

  const user = session.user as any;
  if (user.role !== 'lab_staff' && user.role !== 'superadmin') {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-650 mx-auto" />
          <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">Access Denied</h2>
          <p className="text-xs text-slate-500">You do not have the required administrative role to view the laboratory moderation console.</p>
          <Link href="/admin/dashboard" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const list = await fetchReservations();
  const pendingList = list.filter(r => r.status === 'pending');
  const actionedList = list.filter(r => r.status !== 'pending');

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

        {/* Console Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-2">
          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--primary-maroon)] uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Supervisor Control Panel</span>
          </span>
          <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Equipment Reservations Moderation
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
            Review and approve pending reservation requests from Salahaddin University-Erbil researchers, faculty members, and external collaborators.
          </p>
        </div>

        {/* Reservations Lists layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Pending Queue Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-2 text-[var(--secondary-blue)]">
              <Clock className="w-5 h-5 text-[var(--primary-maroon)]" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                Pending Queue ({pendingList.length})
              </h3>
            </div>

            {pendingList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-400 font-medium italic">
                All requests moderated. The pending reservation queue is currently empty.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingList.map((res) => (
                  <ReservationModerationRow 
                    key={res.id} 
                    reservation={res} 
                    supervisorId={user.staffId} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Actioned / History Queue Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-2 text-[var(--secondary-blue)]">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                Moderation Log & History ({actionedList.length})
              </h3>
            </div>

            {actionedList.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-400 font-medium italic">
                No past reservation records are present in history logs.
              </div>
            ) : (
              <div className="space-y-4">
                {actionedList.slice(0, 15).map((res) => (
                  <ReservationModerationRow 
                    key={res.id} 
                    reservation={res} 
                    supervisorId={user.staffId} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
