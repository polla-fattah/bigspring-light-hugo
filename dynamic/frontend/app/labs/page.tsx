import React from 'react';
import Link from 'next/link';
import { Settings, MapPin, Mail, ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface Equipment {
  id: string;
  name: string;
  category: string | null;
  status: string;
  totalUnits: number;
}

interface Lab {
  id: string;
  title: string;
  shortName: string | null;
  location: string | null;
  locationName: string | null;
  department: string | null;
  departmentName: string | null;
  category: string | null;
  categoryName: string | null;
  description: string | null;
  contact: string | null;
  capacity: string | null;
  status: string;
  equipment: Equipment[];
  supervisor: {
    id: string;
    title: string;
    email: string | null;
  } | null;
}

export default async function LabsPage() {
  let labsList: Lab[] = [];
  let errorMsg = '';

  try {
    labsList = await fetchFromBackend<Lab[]>('/api/labs');
  } catch (err) {
    errorMsg = 'Could not load specialized laboratories directory.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16" id="booking">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and header summaries */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Specialized Facilities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Laboratories & Equipment
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Salahaddin University-Erbil maintains state-of-the-art laboratory instrumentation. Academic staff and students can search and reserve equipment for scientific investigations.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Labs directory list */}
        <div className="space-y-10">
          {labsList.map((lab) => (
            <div 
              key={lab.id} 
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Lab overview column */}
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-green-50 text-green-700 border border-green-100">
                    {lab.status.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-extrabold text-[var(--secondary-blue)] leading-snug">
                    <Link href={`/labs/${lab.id}`} className="hover:underline">
                      {lab.title}
                    </Link>
                  </h3>
                  {lab.departmentName && (
                    <p className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                      Dept: {lab.departmentName}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {lab.description || 'No description guidelines specified for this facility.'}
                </p>

                {/* Location & Supervisor widgets */}
                <div className="space-y-2 pt-2 border-t border-slate-50 text-xs text-slate-450 font-semibold">
                  {lab.locationName && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0 mt-0.5" />
                      <span>{lab.locationName}</span>
                    </div>
                  )}
                  {lab.supervisor && (
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0" />
                      <span>
                        Supervisor:{' '}
                        <Link href={`/staff/${lab.supervisor.id}`} className="text-[var(--secondary-blue)] hover:underline">
                          {lab.supervisor.title}
                        </Link>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link 
                    href={`/labs/${lab.id}`}
                    className="sue-btn-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

              {/* Lab equipment inventory column */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-150 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center space-x-1.5 border-b border-slate-200 pb-3">
                  <Settings className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>Equipment Inventory ({lab.equipment.length})</span>
                </h4>

                {lab.equipment.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No equipment profiles registered for this lab.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-2">
                    {lab.equipment.map((eq) => (
                      <div key={eq.id} className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`inline-block px-1 rounded text-[7px] font-extrabold uppercase ${
                              eq.status === 'available'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {eq.status}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold">Qty: {eq.totalUnits}</span>
                          </div>
                          <h5 className="text-[11px] font-bold text-[var(--secondary-blue)] line-clamp-1">
                            {eq.name}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
