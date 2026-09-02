import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  GraduationCap, 
  Link2, 
  BookOpen, 
  ArrowLeft, 
  Landmark, 
  Award, 
  FileText, 
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
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

function getNameInitial(title: string): string {
  if (!title) return 'U';
  const clean = title
    .replace(/^(Asst\.\s*Prof\.|Prof\.|Dr\.|Doctor)\s*/i, '')
    .trim();
  return clean.charAt(0).toUpperCase() || 'U';
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
            Back to Researchers Directory
          </Link>
        </div>
      </div>
    );
  }

  // Profile citation links list
  const profileLinks = [
    { label: 'Google Scholar Profile', url: detail.googleScholar, icon: Link2, badge: 'Citations' },
    { label: 'Scopus Author ID', url: detail.scopus, icon: Link2, badge: 'Indexed' },
    { label: 'ORCID iD Identifier', url: detail.orcid, icon: Link2, badge: 'Verified' },
    { label: 'ResearchGate Network', url: detail.researchgate, icon: Link2, badge: 'Publications' },
    { label: 'Personal Academic Website', url: detail.personalWebsite, icon: ExternalLink, badge: 'Website' },
  ].filter(link => link.url);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <div>
          <Link href="/staff" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Researchers Directory</span>
          </Link>
        </div>

        {/* ── REDESIGNED HERO PROFILE HEADER CARD ── */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          
          {/* Subtle background gradient accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50/50 via-amber-50/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Avatar Column (Left) */}
            <div className="lg:col-span-3 flex justify-center">
              {detail.image && detail.image.trim() !== '' && detail.image !== 'null' && !detail.image.includes('.svg') ? (
                <img 
                  src={detail.image.startsWith('/') || detail.image.startsWith('http') ? detail.image : `/${detail.image}`} 
                  alt={detail.title} 
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-white shadow-xl ring-2 ring-slate-200/80 shrink-0" 
                />
              ) : (
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-slate-100 via-slate-150 to-slate-200 border-4 border-white shadow-xl ring-2 ring-slate-200/80 flex items-center justify-center text-6xl font-extrabold text-[var(--primary-maroon)] shrink-0">
                  {getNameInitial(detail.title)}
                </div>
              )}
            </div>

            {/* Profile Info Details (Right) */}
            <div className="lg:col-span-9 space-y-5 text-center lg:text-left">
              
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] border border-red-100 tracking-wider">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Salahaddin University Academic</span>
                  </span>
                  {detail.unit && (
                    <Link href={`/units/${detail.unit.id}`} className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all">
                      <GraduationCap className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
                      <span>{detail.unit.title}</span>
                    </Link>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
                  {detail.title}
                </h1>
                
                <p className="text-sm sm:text-base font-semibold text-slate-600">
                  {detail.titlePosition || detail.subtitle || 'Research Associate'}
                </p>
              </div>

              {/* Quick Contact & Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
                {detail.email && (
                  <a 
                    href={`mailto:${detail.email}`} 
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary-maroon)] text-white hover:bg-[var(--primary-maroon-hover)] flex items-center space-x-2 shadow-sm transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Email</span>
                  </a>
                )}

                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white hover:border-[var(--primary-maroon)] flex items-center space-x-1.5 transition-all shadow-2xs"
                  >
                    <span>{link.label.split(' ')[0]}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>

              {/* Research Focus Areas Pills */}
              {detail.researchAreas && detail.researchAreas.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Primary Research Expertise:
                  </h5>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
                    {detail.researchAreas.map((area) => (
                      <span 
                        key={area} 
                        className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-lg"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* ── DYNAMIC CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (8 cols): Biography & Publications */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Biography & Research Summary */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] border-b border-slate-100 pb-4 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[var(--primary-maroon)]" />
                <span>Biography &amp; Academic Overview</span>
              </h3>
              
              <div className="text-xs text-slate-600 leading-relaxed space-y-4 font-normal">
                {detail.bio ? (
                  <p className="text-sm leading-relaxed text-slate-700">{detail.bio}</p>
                ) : (
                  <p className="text-slate-400 italic">No biography statement currently registered for this academic profile.</p>
                )}

                {detail.content && (
                  <div className="pt-3 border-t border-slate-100 text-slate-600 space-y-2">
                    <p>{detail.content}</p>
                  </div>
                )}

                {detail.description && (
                  <div className="pt-3 border-t border-slate-100 text-slate-600 space-y-2">
                    <p>{detail.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scientific Publications & Bibliography */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[var(--primary-maroon)]" />
                  <span>Publications &amp; Research Outputs</span>
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                  {detail.publications.length + detail.supervisedPublications.length} Cataloged
                </span>
              </div>

              {detail.publications.length === 0 && detail.supervisedPublications.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No scientific publications currently cataloged for this researcher in the database.</p>
              ) : (
                <div className="space-y-4">
                  {detail.publications.map((pub) => (
                    <div 
                      key={pub.id} 
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[var(--primary-maroon)] transition-all space-y-2 group"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] border border-red-100">
                          {pub.pubType || 'Journal Article'}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{pub.year || '2024'}</span>
                      </div>
                      
                      <h4 className="text-sm font-extrabold text-[var(--secondary-blue)] group-hover:text-[var(--primary-maroon)] transition-colors leading-snug">
                        <Link href={`/publications/${pub.id}`}>
                          {pub.title}
                        </Link>
                      </h4>
                      
                      {pub.journal && (
                        <p className="text-xs italic text-slate-500 font-medium">
                          Published in: {pub.journal}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Supervised Graduate Theses */}
                  {detail.supervisedPublications.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-[var(--primary-maroon)]" />
                        <span>Supervised Master &amp; PhD Theses</span>
                      </h4>
                      {detail.supervisedPublications.map((pub) => (
                        <div key={pub.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-100 text-amber-900">
                              Supervised Thesis
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{pub.year || '2024'}</span>
                          </div>
                          <h5 className="text-xs font-extrabold text-[var(--secondary-blue)]">
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

          {/* Right Column (4 cols): Citation Indices & Collaborations */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Citation Registry Profiles */}
            {profileLinks.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
                  <span>Academic Registry Indices</span>
                </h3>
                <div className="space-y-2.5">
                  {profileLinks.map((link) => (
                    <a 
                      key={link.label}
                      href={link.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[var(--primary-maroon)] text-slate-700 hover:text-[var(--secondary-blue)] hover:bg-red-50/10 text-xs font-bold transition-all shadow-2xs group"
                    >
                      <div className="flex items-center space-x-2">
                        <link.icon className="w-4 h-4 text-[var(--primary-maroon)] group-hover:scale-110 transition-transform" />
                        <span>{link.label}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Research Collaborations & Active Projects */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
                <span>Research Collaborations</span>
              </h3>
              
              {detail.projects.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No active research project listings currently linked to this academic profile.</p>
              ) : (
                <div className="space-y-3">
                  {detail.projects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] border border-red-100">
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-[var(--secondary-blue)] leading-snug hover:underline">
                        <Link href={`/projects/${proj.id}`}>
                          {proj.title}
                        </Link>
                      </h4>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Associated Research Unit */}
            {detail.unit && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
                  <span>Affiliated Specialized Unit</span>
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">
                    {detail.unit.title}
                  </h4>
                  <Link 
                    href={`/units/${detail.unit.id}`}
                    className="text-xs font-bold text-[var(--primary-maroon)] hover:underline flex items-center space-x-1 pt-1"
                  >
                    <span>View Unit Details</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
