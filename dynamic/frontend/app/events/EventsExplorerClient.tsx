'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Bookmark, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getEventImageUrl } from '@/lib/imageResolver';

interface Event {
  id: number;
  title: string;
  slug: string;
  eventDate: string;
  image: string | null;
  eventType: string;
  featured: boolean;
  description: string | null;
  category: string | null;
  eventTime: string | null;
  location: string | null;
}

interface Props {
  initialEvents: Event[];
}

const ITEMS_PER_PAGE = 12;

export default function EventsExplorerClient({ initialEvents }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    initialEvents.forEach(e => {
      if (e.category) cats.add(e.category);
    });
    return Array.from(cats);
  }, [initialEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return initialEvents.filter(ev => {
      const matchesSearch = 
        !searchQuery.trim() ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.description && ev.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = 
        selectedCategory === 'All' || 
        (ev.category && ev.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [initialEvents, searchQuery, selectedCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedEvents = useMemo(() => {
    const startIdx = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredEvents, validCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Search & Category Filter Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search seminars, workshops & activities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)]/30 focus:border-[var(--primary-maroon)] transition-all"
            />
          </div>

          {/* Result Count Indicator */}
          <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Showing <span className="text-[var(--secondary-blue)]">{filteredEvents.length}</span> total events
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[var(--primary-maroon)] text-white shadow-md shadow-red-900/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {paginatedEvents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No matching events found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedEvents.map((ev) => (
            <div 
              key={ev.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[var(--primary-maroon)] hover:shadow-md transition-all group"
            >
              {/* Event Cover Image */}
              <div className="h-48 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img 
                  src={getEventImageUrl(ev.image, ev.title)} 
                  alt={ev.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Event Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] border border-red-100">
                      {ev.category || 'Seminar'}
                    </span>
                    {ev.featured && (
                      <span className="text-amber-600 uppercase font-extrabold tracking-wider">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] leading-snug line-clamp-2 group-hover:text-[var(--primary-maroon)] transition-colors">
                    <Link href={`/events/${ev.slug}`}>
                      {ev.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {ev.description || 'No detailed announcements text provided.'}
                  </p>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[var(--primary-maroon)]" />
                    <span>{new Date(ev.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  {ev.eventTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[var(--primary-maroon)]" />
                      <span>{ev.eventTime}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[var(--primary-maroon)] shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-right">
                <Link 
                  href={`/events/${ev.slug}`} 
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--primary-maroon)] hover:underline"
                >
                  <span>Read Event Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500">
            Page <span className="text-[var(--secondary-blue)]">{validCurrentPage}</span> of <span className="text-[var(--secondary-blue)]">{totalPages}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 ${
                validCurrentPage === 1
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[var(--primary-maroon)]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - validCurrentPage) <= 2)
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="text-slate-400 text-xs px-1">...</span>}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all ${
                        validCurrentPage === p
                          ? 'bg-[var(--primary-maroon)] text-white shadow-md shadow-red-900/10'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 ${
                validCurrentPage === totalPages
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[var(--primary-maroon)]'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
