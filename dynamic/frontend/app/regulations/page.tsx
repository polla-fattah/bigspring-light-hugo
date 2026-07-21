import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, ArrowDownToLine, Calendar } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface Regulation {
  id: number;
  title: string;
  category: string;
  description: string | null;
  filePath: string;
  fileSize: string | null;
  lastUpdated: string | null;
}

export default async function RegulationsPage() {
  let list: Regulation[] = [];
  let errorMsg = '';

  try {
    list = await fetchFromBackend<Regulation[]>('/api/regulations');
  } catch (err) {
    errorMsg = 'Could not load regulations and safety guidelines.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Ethics & Policies
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Regulations & Safety Guidelines
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            All investigation work conducted at SUE laboratories must strictly conform with the ethical review policies and chemical safety guidelines detailed below.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Regulations list */}
        <div className="max-w-4xl mx-auto space-y-6">
          {list.map((reg) => (
            <div 
              key={reg.id} 
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-[var(--primary-maroon)] transition-all"
            >
              <div className="space-y-3 flex-grow min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
                    {reg.category}
                  </span>
                  {reg.lastUpdated && (
                    <span className="text-[10px] text-slate-400 font-bold">
                      Updated: {new Date(reg.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                  {reg.title}
                </h3>
                
                {reg.description && (
                  <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                    {reg.description}
                  </p>
                )}
              </div>

              {/* Action column */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t border-slate-50 sm:border-0 pt-4 sm:pt-0">
                <a 
                  href={reg.filePath}
                  download
                  className="px-4 py-2 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center space-x-1"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download PDF ({reg.fileSize || 'N/A'})</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
