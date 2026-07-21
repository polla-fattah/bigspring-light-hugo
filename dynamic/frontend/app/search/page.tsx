import React from 'react';
import Link from 'next/link';
import { Search, Filter, Layers, BookOpen, User, Settings, Calendar, Database, FileText } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'staff' | 'project' | 'publication' | 'lab' | 'equipment' | 'event' | 'dataset';
  url: string;
  tags?: string[];
}

interface ApiResponse {
  query: string;
  type: string;
  unitId: string | null;
  count: number;
  results: SearchResult[];
}

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string; unitId?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || '';
  const activeType = params.type || 'all';
  const activeUnit = params.unitId || '';

  // Load results from backend API
  let data: ApiResponse = { query: q, type: activeType, unitId: activeUnit, count: 0, results: [] };
  let errorMsg = '';

  try {
    data = await fetchFromBackend<ApiResponse>(
      `/api/search?q=${encodeURIComponent(q)}&type=${activeType}&unitId=${activeUnit}`
    );
  } catch (err) {
    errorMsg = 'Could not load search results. Please verify the backend API server is running and database is connected.';
  }

  // Categories list for filtering tabs
  const categories = [
    { label: 'All Results', value: 'all', icon: Filter },
    { label: 'Researchers', value: 'staff', icon: User },
    { label: 'Projects', value: 'projects', icon: Layers },
    { label: 'Publications', value: 'publications', icon: BookOpen },
    { label: 'Labs', value: 'labs', icon: Settings },
    { label: 'Datasets', value: 'datasets', icon: Database },
    { label: 'Events', value: 'events', icon: Calendar },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title and description */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Search Research Repository
          </h1>
          <p className="text-sm text-slate-500">
            Query across SUE units, active research logs, published theses, and laboratory equipment catalogs.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8">
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3">
            {/* Persist existing filters */}
            <input type="hidden" name="type" value={activeType} />
            <input type="hidden" name="unitId" value={activeUnit} />

            <div className="flex-grow flex items-center bg-slate-50 rounded-xl px-4 border border-slate-200 focus-within:ring-2 focus-within:ring-[var(--primary-maroon)] focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Type your search query..."
                className="w-full bg-transparent border-0 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none"
              />
            </div>
            
            <button type="submit" className="sue-btn-primary px-8 py-3.5 rounded-xl text-sm font-bold shadow-md">
              Search
            </button>
          </form>
        </div>

        {/* Results layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column Sidebar Navigation Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                Filter by Category
              </h3>
              <nav className="flex flex-col space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/search?q=${encodeURIComponent(q)}&type=${cat.value}&unitId=${activeUnit}`}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeType === cat.value
                        ? 'bg-red-50 text-[var(--primary-maroon)]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <cat.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Column: Results List */}
          <div className="lg:col-span-3 space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs leading-relaxed">
                {errorMsg}
              </div>
            )}

            {!errorMsg && (
              <div className="space-y-4">
                
                {/* Result counts bar */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider px-2">
                  <span>Found {data.count} matches</span>
                  {q && <span>Query: "{q}"</span>}
                </div>

                {/* Empty State */}
                {data.count === 0 && (
                  <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[var(--secondary-blue)]">
                        No results found
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Try modifying your query, check spelling, or select a different category filter in the sidebar.
                      </p>
                    </div>
                  </div>
                )}

                {/* Results List items */}
                {data.results && data.results.map((result) => (
                  <div 
                    key={result.type + '-' + result.id} 
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-[var(--primary-maroon)] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      
                      {/* Badge indicator */}
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
                          {result.type}
                        </span>
                        {result.tags && result.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] font-bold text-slate-400">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-[var(--secondary-blue)] hover:text-[var(--primary-maroon)] transition-colors">
                        <Link href={result.url}>
                          {result.title}
                        </Link>
                      </h3>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {result.description}
                      </p>

                    </div>

                    <div className="pt-4 border-t border-slate-50 mt-4 flex justify-end">
                      <Link 
                        href={result.url}
                        className="text-xs font-bold text-[var(--primary-maroon)] hover:underline flex items-center space-x-1"
                      >
                        <span>View details</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
