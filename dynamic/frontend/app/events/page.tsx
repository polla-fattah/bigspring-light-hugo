import React from 'react';
import { fetchFromBackend } from '../../lib/api';
import EventsExplorerClient from './EventsExplorerClient';

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

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Summary */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-[var(--primary-maroon)] tracking-wider uppercase">
            SUE Research Archive
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
            Research Events & Seminars
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Explore authentic research activities, seminars, workshops, and scientific events hosted by the Salahaddin University-Erbil Research Center.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-xs max-w-lg mx-auto text-center">
            {errorMsg}
          </div>
        )}

        <EventsExplorerClient initialEvents={events} />

      </div>
    </div>
  );
}
