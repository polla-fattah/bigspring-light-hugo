import React from 'react';
import Link from 'next/link';
import { Database, Download, Calendar, Layers, ExternalLink } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface Dataset {
  id: string;
  title: string;
  description: string | null;
  year: string | null;
  access: string | null;
  format: string | null;
  size: string | null;
  unit: UnitSummary | null;
}

export default async function DatasetsPage() {
  let datasets: Dataset[] = [];
  let errorMsg = '';

  try {
    datasets = await fetchFromBackend<Dataset[]>('/api/datasets');
  } catch (err) {
    errorMsg = 'Could not load public datasets directory.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header details */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Open Science Core
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Datasets Directory
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            In compliance with our Open Science initiatives, researchers publish reference datasets to allow verification of study models and encourage regional collaborations.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Datasets listing grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {datasets.map((ds) => (
            <div 
              key={ds.id} 
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm sue-card flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Format Badges */}
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
                    {ds.format || 'ZIP'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Access: {ds.access || 'Open'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-[var(--secondary-blue)] leading-snug">
                    {ds.title}
                  </h3>
                  {ds.unit && (
                    <p className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                      Unit: {ds.unit.title}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {ds.description || 'No dataset metadata summary is currently published.'}
                </p>

              </div>

              {/* Action buttons */}
              <div className="pt-5 border-t border-slate-100 mt-6 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-455 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-350" />
                  <span>Year: {ds.year || '2024'}</span>
                </span>
                
                <button className="text-[var(--primary-maroon)] hover:underline flex items-center space-x-1 hover:scale-102 transition-all cursor-not-allowed" disabled>
                  <Download className="w-4 h-4" />
                  <span>Request File ({ds.size || 'N/A'})</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
