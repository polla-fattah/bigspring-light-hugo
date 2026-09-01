import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { fetchFromBackend } from '../../lib/api';
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

export default async function EventsListPage() {
  let events: Event[] = [];
  let errorMsg = '';

  try {
    events = await fetchFromBackend<Event[]>('/api/events');
  } catch (err) {
    errorMsg = 'Could not load upcoming research events.';
  }

  // Sort: upcoming events first, then past
  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.eventDate) >= now)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const pastEvents = events
    .filter((e) => new Date(e.eventDate) < now)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            SUE Calendar
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Events & Seminars
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Stay up to date with upcoming academic seminars, defense presentations, workshops, and international conferences coordinated by Salahaddin University-Erbil.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        {/* 1. UPCOMING EVENTS */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-[var(--secondary-blue)] border-b border-slate-200 pb-3">
            <Bookmark className="w-5 h-5 text-[var(--primary-maroon)]" />
            <h2 className="text-lg font-extrabold tracking-wide uppercase">
              Upcoming Announcements & Programs ({upcomingEvents.length})
            </h2>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-xs text-slate-400 font-medium italic shadow-sm">
              No upcoming events are scheduled at this moment. Please check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((ev) => (
                <div 
                  key={ev.id} 
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[var(--primary-maroon)] hover:shadow-md transition-all group"
                >
                  {/* Event Primary Image */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img 
                      src={getEventImageUrl(ev.image, ev.title)} 
                      alt={ev.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

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
                          <MapPin className="w-4 h-4 text-[var(--primary-maroon)]" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

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
        </div>

        {/* 2. PAST EVENTS */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center space-x-2 text-slate-400 border-b border-slate-200 pb-3">
            <Bookmark className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-extrabold tracking-wide uppercase">
              Past Seminars & Archive ({pastEvents.length})
            </h2>
          </div>

          {pastEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-xs text-slate-400 font-medium italic shadow-sm">
              No archive records.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.slice(0, 12).map((ev) => (
                <div 
                  key={ev.id} 
                  className="bg-white/80 rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between opacity-90 hover:opacity-100 transition-all group"
                >
                  {/* Event Cover Image */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                    {ev.image ? (
                      <img 
                        src={ev.image} 
                        alt={ev.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center p-6 text-center text-white">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
                          SUE Archived Event
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500">
                          {ev.category || 'Archived'}
                        </span>
                        <span className="text-slate-400">Completed</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                        <Link href={`/events/${ev.slug}`} className="hover:text-[var(--primary-maroon)]">
                          {ev.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-medium text-slate-500 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date: {new Date(ev.eventDate).toLocaleDateString()}</span>
                      </div>
                      {ev.location && (
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-right">
                    <Link 
                      href={`/events/${ev.slug}`} 
                      className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-[var(--primary-maroon)] hover:underline"
                    >
                      <span>View Archive & Gallery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
