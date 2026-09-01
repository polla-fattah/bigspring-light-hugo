import React from 'react';
import { FileText, ArrowDownToLine, ShieldCheck, FileCheck, Award, FileSignature } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface Form {
  id: number;
  title: string;
  category: string;
  formType: string | null;
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
    errorMsg = 'Could not load proposal templates and ethical review forms.';
  }

  // Group forms into categories
  const ethicsForms = list.filter((f) => f.category === 'Ethics' || f.formType?.startsWith('ethics'));
  const proposalForms = list.filter((f) => f.category === 'Proposals' || f.formType === 'proposal');
  const contractForms = list.filter((f) => f.category === 'Contracts' || f.formType === 'contract' || f.formType === 'volunteer_contract');
  const otherForms = list.filter(
    (f) => !ethicsForms.includes(f) && !proposalForms.includes(f) && !contractForms.includes(f)
  );

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header details */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            Official Forms & Ethics Clearance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Forms, Ethics & Applications
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Download mandatory ethical clearance application forms (Human, Animal, Botanical, Humanities & Law), faculty research plans, and student/volunteer laboratory contracts.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center mb-8">
            {errorMsg}
          </div>
        )}

        {/* Section 1: Ethical Review Application Forms */}
        <div className="max-w-5xl mx-auto space-y-12">
          
          {ethicsForms.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <ShieldCheck className="w-6 h-6 text-[var(--primary-maroon)]" />
                <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">
                  Research Ethics Review Applications
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ethicsForms.map((form) => (
                  <div 
                    key={form.id} 
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[var(--primary-maroon)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200">
                          {form.category} Review
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {form.fileFormat || 'DOCX'}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {form.description}
                        </p>
                      )}
                    </div>

                    <a 
                      href={form.filePath}
                      download
                      className="px-4 py-2.5 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-2 border border-slate-200"
                    >
                      <ArrowDownToLine className="w-4 h-4 text-[var(--primary-maroon)] group-hover:text-white" />
                      <span>Download {form.fileFormat || 'Document'}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Research Proposals & Plans */}
          {proposalForms.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <FileSignature className="w-6 h-6 text-[var(--primary-maroon)]" />
                <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">
                  Research Proposals & Faculty Plans
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposalForms.map((form) => (
                  <div 
                    key={form.id} 
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[var(--primary-maroon)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide bg-blue-50 text-blue-800 border border-blue-200">
                          {form.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {form.fileFormat || 'PDF'}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {form.description}
                        </p>
                      )}
                    </div>

                    <a 
                      href={form.filePath}
                      download
                      className="px-4 py-2.5 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-2 border border-slate-200"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>Download {form.fileFormat || 'Document'}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Contracts & Guidelines */}
          {contractForms.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <FileCheck className="w-6 h-6 text-[var(--primary-maroon)]" />
                <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">
                  Student & Volunteer Laboratory Contracts
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contractForms.map((form) => (
                  <div 
                    key={form.id} 
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[var(--primary-maroon)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {form.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {form.fileFormat || 'PDF'}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {form.description}
                        </p>
                      )}
                    </div>

                    <a 
                      href={form.filePath}
                      download
                      className="px-4 py-2.5 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-2 border border-slate-200"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>Download {form.fileFormat || 'Document'}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: General / Other Forms */}
          {otherForms.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
                <FileText className="w-6 h-6 text-[var(--primary-maroon)]" />
                <h2 className="text-lg font-extrabold text-[var(--secondary-blue)]">
                  General Application Templates
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherForms.map((form) => (
                  <div 
                    key={form.id} 
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[var(--primary-maroon)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
                          {form.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {form.description}
                        </p>
                      )}
                    </div>

                    <a 
                      href={form.filePath}
                      download
                      className="px-4 py-2.5 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-2 border border-slate-200"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>Download Template</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

