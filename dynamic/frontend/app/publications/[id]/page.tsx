import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowLeft, ScrollText, Users, Landmark, UserCheck } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface AssociatedAuthor {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
}

interface PublicationDetail {
  id: string;
  title: string;
  pubType: string;
  degree: string | null;
  year: string | null;
  description: string | null;
  pdf: string | null;
  journal: string | null;
  unit: UnitSummary | null;
  authors: AssociatedAuthor[];
  supervisor: {
    id: string;
    title: string;
  } | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  let detail: PublicationDetail | null = null;
  let errorMsg = '';

  try {
    detail = await fetchFromBackend<PublicationDetail>(`/api/publications/${id}`);
  } catch (err) {
    errorMsg = 'Could not load publication details.';
  }

  if (errorMsg || !detail) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-600 font-bold">{errorMsg || 'Publication not found.'}</p>
          <Link href="/publications" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link href="/publications" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Publications List</span>
          </Link>
        </div>

        {/* Paper details board */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-slate-400">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
              {detail.pubType}
            </span>
            {detail.year && (
              <span className="flex items-center space-x-1 font-semibold ml-2">
                <Calendar className="w-3.5 h-3.5 text-slate-350" />
                <span>Published in {detail.year}</span>
              </span>
            )}
          </div>

          <div className="space-y-2">
            {detail.unit && (
              <p className="text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                Unit: {detail.unit.title}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight leading-snug">
              {detail.title}
            </h1>
          </div>

          {detail.journal && (
            <div className="text-xs text-slate-455 font-bold italic bg-slate-50 border border-slate-150 p-4 rounded-xl">
              Journal / Venue: {detail.journal}
            </div>
          )}

          {/* Abstract section */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] uppercase tracking-wider">
              Abstract / Description
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed max-w-4xl">
              {detail.description || 'No abstract text has been uploaded yet for this scientific publication reference.'}
            </p>
          </div>

          {/* Download button */}
          {detail.pdf && (
            <div className="pt-6 border-t border-slate-100 flex">
              <a 
                href={detail.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="sue-btn-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <ScrollText className="w-4 h-4" />
                <span>View Full-Text PDF</span>
              </a>
            </div>
          )}
        </div>

        {/* Authors and Supervisor row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Authors List card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
              <Users className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Authors & Co-investigators ({detail.authors.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detail.authors.map((author) => (
                <div key={author.id} className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
                  <div className="w-9 h-9 rounded-full bg-slate-150 text-[var(--primary-maroon)] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {author.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--secondary-blue)] hover:underline">
                      <Link href={`/staff/${author.id}`}>
                        {author.title}
                      </Link>
                    </h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      {author.subtitle || 'Research Author'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor Card */}
          {detail.supervisor && (
            <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Thesis Advisor
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[var(--primary-maroon)] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--secondary-blue)] hover:underline">
                    <Link href={`/staff/${detail.supervisor.id}`}>
                      {detail.supervisor.title}
                    </Link>
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Research Advisor
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
