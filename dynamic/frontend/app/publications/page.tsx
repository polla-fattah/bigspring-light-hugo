import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight, UserCheck, ScrollText } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface UnitSummary {
  id: string;
  title: string;
}

interface AuthorSummary {
  id: string;
  title: string;
}

interface Publication {
  id: string;
  title: string;
  pubType: string;
  degree: string | null;
  year: string | null;
  pdf: string | null;
  journal: string | null;
  unit: UnitSummary | null;
  authors: AuthorSummary[];
}

export default async function PublicationsPage() {
  let pubList: Publication[] = [];
  let errorMsg = '';

  try {
    pubList = await fetchFromBackend<Publication[]>('/api/publications');
  } catch (err) {
    errorMsg = 'Could not load scientific publications library.';
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            SUE Library Index
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Scientific Publications & Theses
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Explore the indexed research papers, journal articles, and graduate theses authored by the staff and students at SUE.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* Publications listing */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {pubList.map((pub) => (
            <div 
              key={pub.id} 
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-[var(--primary-maroon)] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            >
              <div className="space-y-3 flex-grow min-w-0">
                
                {/* Badges row */}
                <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-slate-400">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
                    {pub.pubType}
                  </span>
                  {pub.degree && (
                    <span className="text-[10px] text-slate-500">
                      Degree: {pub.degree}
                    </span>
                  )}
                  {pub.year && (
                    <span className="flex items-center space-x-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-slate-350" />
                      <span>{pub.year}</span>
                    </span>
                  )}
                </div>

                {/* Paper Title */}
                <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug">
                  <Link href={`/publications/${pub.id}`} className="hover:underline">
                    {pub.title}
                  </Link>
                </h3>

                {/* Journal / SUE Unit info */}
                {pub.journal && (
                  <p className="text-xs italic text-slate-400">
                    Journal: {pub.journal}
                  </p>
                )}

                {/* Authors names */}
                {pub.authors && pub.authors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-slate-500 font-semibold items-center">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--primary-maroon)] flex-shrink-0" />
                    <span>Authors:</span>
                    {pub.authors.map((author, index) => (
                      <React.Fragment key={author.id}>
                        <Link href={`/staff/${author.id}`} className="hover:text-[var(--primary-maroon)] hover:underline">
                          {author.title}
                        </Link>
                        {index < pub.authors.length - 1 && <span className="text-slate-300">,</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}

              </div>

              {/* View/Download column */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t border-slate-50 sm:border-0 pt-4 sm:pt-0">
                {pub.pdf && (
                  <a 
                    href={pub.pdf} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-slate-55 hover:bg-[var(--primary-maroon)] hover:text-white rounded-xl text-xs font-bold text-slate-600 transition-colors flex items-center space-x-1"
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>PDF Document</span>
                  </a>
                )}
                
                <Link 
                  href={`/publications/${pub.id}`}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-[var(--primary-maroon)] text-slate-400 hover:text-[var(--primary-maroon)] hover:bg-red-50/10 flex items-center justify-center transition-all"
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
