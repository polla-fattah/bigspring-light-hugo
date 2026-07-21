import React from 'react';
import Link from 'next/link';
import { Mail, GraduationCap, Link2, BookOpen, Layers, ArrowLeft, Landmark } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface AssociatedProject {
  id: string;
  title: string;
  status: string;
  projectType: string | null;
}

interface AssociatedPublication {
  id: string;
  title: string;
  pubType: string;
  year: string | null;
  journal: string | null;
}

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
  content: string | null;
  description: string | null;
  researchAreas: string[];
  unit: UnitSummary | null;
  projects: AssociatedProject[];
  publications: AssociatedPublication[];
  supervisedPublications: AssociatedPublication[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaffDetailPage({ params }: PageProps) {
  const { id } = await params;
  let detail: StaffDetail | null = null;
  let errorMsg = '';

  try {
    detail = await fetchFromBackend<StaffDetail>(`/api/staff/${id}`);
  } catch (err) {
    errorMsg = 'Could not load researcher profile details.';
  }

  if (errorMsg || !detail) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-600 font-bold">{errorMsg || 'Researcher profile not found.'}</p>
          <Link href="/staff" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Profile citation links list
  const profileLinks = [
    { label: 'Google Scholar', url: detail.googleScholar, icon: Link2 },
    { label: 'Scopus ID', url: detail.scopus, icon: Link2 },
    { label: 'ORCID', url: detail.orcid, icon: Link2 },
    { label: 'ResearchGate', url: detail.researchgate, icon: Link2 },
    { label: 'Personal Website', url: detail.personalWebsite, icon: Link2 },
  ].filter(link => link.url);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link href="/staff" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Researchers Directory</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Avatar column */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-slate-50 border-4 border-slate-100 flex items-center justify-center text-5xl font-extrabold text-[var(--primary-maroon)] shadow-inner">
              {detail.title.charAt(0)}
            </div>
          </div>

          {/* Details column */}
          <div className="lg:col-span-9 space-y-5 text-center lg:text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                <Landmark className="w-3.5 h-3.5" />
                <span>Salahaddin University Academic</span>
              </span>
              <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
                {detail.title}
              </h1>
              <p className="text-sm font-semibold text-slate-400">
                {detail.titlePosition || detail.subtitle || 'Research Associate'}
              </p>
            </div>

            {/* Contact & Unit row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {detail.unit && (
                <div className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-150 px-3.5 py-2 rounded-xl flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>{detail.unit.title}</span>
                </div>
              )}
              {detail.email && (
                <a href={`mailto:${detail.email}`} className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-150 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 hover:border-[var(--primary-maroon)] hover:bg-red-50/20 transition-all">
                  <Mail className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>{detail.email}</span>
                </a>
              )}
            </div>

            {/* Research areas */}
            {detail.researchAreas && detail.researchAreas.length > 0 && (
              <div className="pt-2">
                <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Primary Research Areas
                </h5>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {detail.researchAreas.map(area => (
                    <span key={area} className="text-xs font-bold bg-red-50/40 text-[var(--primary-maroon)] border border-red-100/60 px-3 py-1 rounded-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Dynamic section grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Biography & Citation Index profiles */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Biography */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] border-b border-slate-100 pb-3">
                Biography / Research Summary
              </h3>
              <div className="text-xs text-slate-550 leading-relaxed space-y-3">
                {detail.bio ? (
                  <p>{detail.bio}</p>
                ) : (
                  <p>No biography registered for this researcher profile.</p>
                )}
                {detail.content && (
                  <div className="pt-2 mt-2 border-t border-slate-50 text-slate-500 font-medium">
                    {detail.content}
                  </div>
                )}
              </div>
            </div>

            {/* Publications list */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
                <BookOpen className="w-5 h-5 text-[var(--primary-maroon)]" />
                <span>Publications & Bibliography ({detail.publications.length + detail.supervisedPublications.length})</span>
              </h3>

              {detail.publications.length === 0 && detail.supervisedPublications.length === 0 ? (
                <p className="text-xs text-slate-400">No scientific publications currently cataloged for this researcher.</p>
              ) : (
                <div className="space-y-6">
                  {detail.publications.map((pub) => (
                    <div key={pub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 hover:border-slate-250 transition-all flex flex-col justify-between h-fit">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)]">
                            {pub.pubType}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{pub.year || '2024'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[var(--secondary-blue)] leading-snug">
                          <Link href={`/publications/${pub.id}`} className="hover:underline">
                            {pub.title}
                          </Link>
                        </h4>
                        {pub.journal && (
                          <p className="text-[10px] italic text-slate-400">
                            Journal: {pub.journal}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Supervised Theses */}
                  {detail.supervisedPublications.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Supervised Graduate Theses
                      </h4>
                      {detail.supervisedPublications.map((pub) => (
                        <div key={pub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 hover:border-slate-250 transition-all">
                          <div className="flex justify-between items-center mb-1">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500">
                              {pub.pubType} (Supervised)
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{pub.year || '2024'}</span>
                          </div>
                          <h5 className="text-xs font-bold text-[var(--secondary-blue)]">
                            <Link href={`/publications/${pub.id}`} className="hover:underline">
                              {pub.title}
                            </Link>
                          </h5>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

          {/* Right Column: Research profiles and project collabs */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Citation Profile Links */}
            {profileLinks.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                  Citation Profile Links
                </h3>
                <div className="space-y-2">
                  {profileLinks.map((link) => (
                    <a 
                      key={link.label}
                      href={link.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[var(--primary-maroon)] text-slate-600 hover:text-[var(--secondary-blue)] hover:bg-red-50/10 text-xs font-bold transition-all"
                    >
                      <span>{link.label}</span>
                      <link.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Collaborative Projects */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Research Collaborations
              </h3>
              
              {detail.projects.length === 0 ? (
                <p className="text-xs text-slate-400">No active research project listings linked to this profile.</p>
              ) : (
                <div className="space-y-3">
                  {detail.projects.map((proj) => (
                    <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)]">
                            {proj.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[var(--secondary-blue)] line-clamp-2 hover:underline">
                          <Link href={`/projects/${proj.id}`}>
                            {proj.title}
                          </Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
