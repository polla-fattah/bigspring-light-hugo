import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Server, Database, Users } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface ResearchUnit {
  id: string;
  title: string;
  name: string;
  image: string | null;
  description: string | null;
}

export default async function UnitsPage() {
  let units: ResearchUnit[] = [];
  let errorMsg = '';

  try {
    units = await fetchFromBackend<ResearchUnit[]>('/api/units');
  } catch (err) {
    errorMsg = 'Could not load research units data.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Institutional Layout
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Units & Centers
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The SUE Research Center is structured into 8 distinct research units driving innovations in engineering, environmental sciences, digital humanities, and informatics.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div 
              key={unit.id} 
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm sue-card flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-[var(--primary-maroon)] flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                    Unit ID: {unit.id.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-extrabold text-[var(--secondary-blue)] line-clamp-1">
                    {unit.title}
                  </h3>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {unit.description || 'No description available for this SUE Research Unit.'}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Explore activities
                </span>
                <Link 
                  href={`/units/${unit.id}`}
                  className="w-9 h-9 rounded-lg bg-slate-55 hover:bg-[var(--primary-maroon)] text-slate-600 hover:text-white flex items-center justify-center transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
