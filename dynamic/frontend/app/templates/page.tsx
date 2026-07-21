import React from 'react';
import { FileText, ArrowDownToLine } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface Form {
  id: number;
  title: string;
  category: string;
  description: string | null;
  filePath: string;
  fileFormat: string | null;
  fileSize: string | null;
  icon: string;
}

export default async function TemplatesPage() {
  let list: Form[] = [];
  let errorMsg = '';

  try {
    list = await fetchFromBackend<Form[]>('/api/forms');
  } catch (err) {
    errorMsg = 'Could not load proposal templates directory.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header details */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Application Kits
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Proposal Forms & Templates
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Download standard proposal submission templates, equipment reservation forms, and funding request outlines.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Templates directory list */}
        <div className="max-w-4xl mx-auto space-y-6">
          {list.map((form) => (
            <div 
              key={form.id} 
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-[var(--primary-maroon)] transition-all"
            >
              <div className="flex items-start space-x-4 flex-grow min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[var(--primary-maroon)] flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
                    {form.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {form.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action column */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t border-slate-50 sm:border-0 pt-4 sm:pt-0">
                <a 
                  href={form.filePath}
                  download
                  className="px-4 py-2 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center space-x-1"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download ({form.fileFormat || 'DOCX'} • {form.fileSize || 'N/A'})</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
