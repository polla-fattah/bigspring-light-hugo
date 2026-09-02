import React from 'react';
import Link from 'next/link';
import { Mail, GraduationCap, ArrowRight, Compass } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface StaffMember {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  titlePosition: string | null;
  email: string | null;
  researchAreas: string[];
  unit: UnitSummary | null;
}

function getNameInitial(title: string): string {
  if (!title) return 'U';
  const clean = title
    .replace(/^(Asst\.\s*Prof\.|Prof\.|Dr\.|Doctor)\s*/i, '')
    .trim();
  return clean.charAt(0).toUpperCase() || 'U';
}

export default async function StaffPage() {
  let staffList: StaffMember[] = [];
  let errorMsg = '';

  try {
    staffList = await fetchFromBackend<StaffMember[]>('/api/staff');
  } catch (err) {
    errorMsg = 'Could not load researchers directory.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title details */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            SUE Experts Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Researchers & Academic Staff
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Meet the researchers, lecturers, and lab supervisors directing academic inquiries across Salahaddin University-Erbil.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Staff cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffList.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sue-card flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header profile details */}
                <div className="flex items-center space-x-4">
                  {member.image && member.image.trim() !== '' && member.image !== 'null' && !member.image.includes('.svg') ? (
                    <img 
                      src={member.image.startsWith('/') || member.image.startsWith('http') ? member.image : `/${member.image}`} 
                      alt={member.title} 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200/80 shadow-sm shrink-0" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-extrabold text-[var(--primary-maroon)] text-2xl shadow-inner shrink-0">
                      {getNameInitial(member.title)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] hover:text-[var(--primary-maroon)] transition-colors">
                      <Link href={`/staff/${member.id}`}>
                        {member.title}
                      </Link>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {member.titlePosition || member.subtitle || 'Research Associate'}
                    </p>
                  </div>
                </div>

                {/* Unit tag info */}
                {member.unit && (
                  <div className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-lg inline-flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
                    <span>{member.unit.title}</span>
                  </div>
                )}

                {/* Bio or Areas preview */}
                {member.researchAreas && member.researchAreas.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Research Areas:
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {member.researchAreas.slice(0, 3).map((area) => (
                        <span key={area} className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-150 px-2 py-0.5 rounded-md">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action buttons */}
              <div className="pt-5 border-t border-slate-100 mt-6 flex justify-between items-center">
                {member.email ? (
                  <a href={`mailto:${member.email}`} className="text-[10px] font-semibold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact email</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-350">No email listed</span>
                )}
                
                <Link 
                  href={`/staff/${member.id}`}
                  className="text-xs font-bold text-[var(--primary-maroon)] hover:underline flex items-center space-x-1"
                >
                  <span>CV Details</span>
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
