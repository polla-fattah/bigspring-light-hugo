import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowLeft, Landmark, Image as ImageIcon } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';

interface EventDetail {
  title: string;
  slug: string;
  eventDate: string;
  image: string | null;
  galleryImages?: string[];
  eventType: string;
  featured: boolean;
  description: string | null;
  content: string | null;
  category: string | null;
  eventTime: string | null;
  location: string | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let detail: EventDetail | null = null;
  let errorMsg = '';

  try {
    detail = await fetchFromBackend<EventDetail>(`/api/events/${slug}`);
  } catch (err) {
    errorMsg = 'Could not load event announcement details.';
  }

  if (errorMsg || !detail) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-600 font-bold">{errorMsg || 'Event announcement not found.'}</p>
          <Link href="/events" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link href="/events" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* 1. OPTIONAL HERO BANNER IMAGE (Top of Event Detail) */}
        {detail.image && detail.image.trim() !== '' && (
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 relative">
            <img 
              src={detail.image} 
              alt={detail.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 2. MAIN EVENT DETAIL CONTENT CARD */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
          
          <div className="flex flex-wrap gap-2 items-center text-[10px] font-bold text-slate-400">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-red-50 text-[var(--primary-maroon)] border border-red-100">
              {detail.category || 'Event'}
            </span>
            {detail.featured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-100">
                Featured
              </span>
            )}
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>SUE Research Announcement</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight leading-snug">
              {detail.title}
            </h1>
          </div>

          {/* Time, Date, and Location Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-150 p-5 rounded-2xl text-xs font-semibold text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4.5 h-4.5 text-[var(--primary-maroon)] flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Event Date</p>
                <p className="mt-0.5">{new Date(detail.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            
            {detail.eventTime && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4.5 h-4.5 text-[var(--primary-maroon)] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Event Time</p>
                  <p className="mt-0.5">{detail.eventTime}</p>
                </div>
              </div>
            )}

            {detail.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4.5 h-4.5 text-[var(--primary-maroon)] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Location</p>
                  <p className="mt-0.5 truncate">{detail.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description & Full Article Content */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {detail.description && (
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                {detail.description}
              </p>
            )}
            
            {detail.content && (
              <div className="text-xs text-slate-600 leading-relaxed space-y-3 pt-2 font-medium whitespace-pre-line">
                {detail.content}
              </div>
            )}
          </div>

          {/* 3. OTHER GALLERY IMAGES (Bottom of Event Detail) */}
          {detail.galleryImages && detail.galleryImages.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--secondary-blue)] flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[var(--primary-maroon)]" />
                <span>Event Gallery ({detail.galleryImages.length} Photos)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detail.galleryImages.map((imgUrl, idx) => (
                  <a key={idx} href={imgUrl} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img src={imgUrl} alt={`${detail.title} - photo ${idx + 1}`} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
