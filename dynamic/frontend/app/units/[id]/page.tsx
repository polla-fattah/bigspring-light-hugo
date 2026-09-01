import React from 'react';
import Link from 'next/link';
import { Layers, Users, BookOpen, Database, User, ArrowRight, Landmark } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';

interface AssociatedStaff {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  titlePosition: string | null;
  email: string | null;
  researchAreas: string[];
}

interface AssociatedProject {
  id: string;
  title: string;
  name: string;
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

interface AssociatedDataset {
  id: string;
  title: string;
  format: string | null;
  access: string | null;
}

interface UnitDetail {
  id: string;
  title: string;
  name: string;
  image: string | null;
  description: string | null;
  staff: AssociatedStaff[];
  projects: AssociatedProject[];
  publications: AssociatedPublication[];
  datasets: AssociatedDataset[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  let detail: UnitDetail | null = null;
  let errorMsg = '';

  try {
    detail = await fetchFromBackend<UnitDetail>(`/api/units/${id}`);
  } catch (err) {
    errorMsg = 'Could not load Research Unit details.';
  }

  if (errorMsg || !detail) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-600 font-bold">{errorMsg || 'Research Unit not found.'}</p>
          <Link href="/units" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Units
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Unit Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--primary-maroon)] uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>SUE Unit Profile</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
              {detail.title}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              {detail.description || 'No description guidelines available for this research center unit.'}
            </p>

            {/* Special Spotlight for EMCCU: JISDS Journal & Dashboards */}
            {detail.id === 'emccu' && (
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-200/60 text-amber-900">
                    Flagship Journal Initiative
                  </span>
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">
                    Journal of Intelligent Spatial Data Science (JISDS)
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Peer-reviewed scientific journal focusing on GIS, satellite remote sensing, and AI-driven spatial analysis, established in partnership with Sapienza University of Rome.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/80 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-200/60 text-blue-900">
                    Real-Time Environmental Monitoring
                  </span>
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">
                    GIS & Remote Sensing Dashboards
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Broadcast and decision-ready dashboards tracking mountain snow-cover change (Zagros range), precipitation, ERA5 climate datasets, and soil contamination.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-4 hidden lg:flex justify-end pr-4">
            <div className="w-28 h-28 rounded-2xl bg-slate-50 text-[var(--primary-maroon)] flex items-center justify-center border border-slate-200">
              <Layers className="w-14 h-14" />
            </div>
          </div>
        </div>

        {/* Dynamic section grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Researchers (Staff) list */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
              <Users className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Unit Researchers ({detail.staff.length})</span>
            </h3>
            
            {detail.staff.length === 0 ? (
              <p className="text-xs text-slate-400">No staff members currently linked to this unit.</p>
            ) : (
              <div className="space-y-4">
                {detail.staff.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {member.title.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)] truncate">
                        <Link href={`/staff/${member.id}`} className="hover:underline">
                          {member.title}
                        </Link>
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {member.titlePosition || member.subtitle || 'Research Associate'}
                      </p>
                    </div>
                    <Link href={`/staff/${member.id}`} className="text-slate-400 hover:text-[var(--primary-maroon)] transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Active Projects list */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
              <Layers className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Active Projects ({detail.projects.length})</span>
            </h3>

            {detail.projects.length === 0 ? (
              <p className="text-xs text-slate-400">No active research projects in this unit.</p>
            ) : (
              <div className="space-y-4">
                {detail.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-2 flex flex-col justify-between h-32">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)]">
                          {proj.status}
                        </span>
                        {proj.projectType && (
                          <span className="text-[9px] font-bold text-slate-400">
                            {proj.projectType}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)] line-clamp-2">
                        <Link href={`/projects/${proj.id}`} className="hover:underline">
                          {proj.title}
                        </Link>
                      </h4>
                    </div>
                    <div className="flex justify-end">
                      <Link href={`/projects/${proj.id}`} className="text-[10px] font-bold text-[var(--primary-maroon)] hover:underline flex items-center space-x-1">
                        <span>Details</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Publications & Datasets */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8 col-span-1">
            
            {/* Publications */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
                <BookOpen className="w-5 h-5 text-[var(--primary-maroon)]" />
                <span>Unit Papers ({detail.publications.length})</span>
              </h3>

              {detail.publications.length === 0 ? (
                <p className="text-xs text-slate-400">No publications archived in this unit.</p>
              ) : (
                <div className="space-y-3">
                  {detail.publications.slice(0, 5).map((pub) => (
                    <div key={pub.id} className="text-xs space-y-1 p-2 hover:bg-slate-50 rounded-lg">
                      <h4 className="font-bold text-[var(--secondary-blue)] line-clamp-2">
                        <Link href={`/publications/${pub.id}`} className="hover:underline">
                          {pub.title}
                        </Link>
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {pub.pubType.toUpperCase()} • {pub.year || '2024'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Datasets */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
                <Database className="w-5 h-5 text-[var(--primary-maroon)]" />
                <span>Open Datasets ({detail.datasets.length})</span>
              </h3>

              {detail.datasets.length === 0 ? (
                <p className="text-xs text-slate-400">No public datasets associated with this unit.</p>
              ) : (
                <div className="space-y-3">
                  {detail.datasets.map((ds) => (
                    <div key={ds.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--secondary-blue)] line-clamp-1">
                          {ds.title}
                        </h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Format: {ds.format || 'CSV'} • Access: {ds.access || 'Open'}
                        </p>
                      </div>
                      <Link href="/datasets" className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--primary-maroon)] hover:bg-white transition-colors flex-shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
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
