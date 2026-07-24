'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { createPublicationDraft } from '../actions';

interface Unit {
  id: string;
  title: string;
}

interface Props {
  units: Unit[];
  staffId: string;
}

export default function PublicationSubmitForm({ units, staffId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form Fields State
  const [title, setTitle] = useState('');
  const [pubType, setPubType] = useState('article');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [unitId, setUnitId] = useState('');
  const [journal, setJournal] = useState('');
  const [pdf, setPdf] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPublicationDraft({
        title,
        pubType,
        degree: pubType === 'thesis' ? degree : null,
        year: year ? String(year) : null,
        unitId: unitId || null,
        description: description || null,
        pdf: pdf || null,
        journal: journal || null,
        creatorStaffId: staffId,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while submitting proposal.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
        <h3 className="text-lg font-extrabold text-[var(--secondary-blue)]">Proposal Submitted Successfully!</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Your publication draft has been saved. The site administrators will review and catalog it shortly. Redirecting you to the dashboard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Publication Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Multi-Factor Classification Using Deep Learning for X-ray Images"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Type Selection */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Type of Publication *
          </label>
          <select
            value={pubType}
            onChange={(e) => setPubType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          >
            <option value="article">Article / Journal Paper</option>
            <option value="thesis">Thesis / Dissertation</option>
            <option value="report">Research Report</option>
          </select>
        </div>

        {/* Year */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wide">
            Year of Publication
          </label>
          <input
            type="number"
            min="1990"
            max={new Date().getFullYear() + 1}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Conditionally Render: Thesis Degree */}
        {pubType === 'thesis' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wide">
              Degree (MSc / PhD)
            </label>
            <input
              type="text"
              placeholder="e.g. PhD Computer Science"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
            />
          </div>
        )}

        {/* Journal / Venue name */}
        {pubType !== 'thesis' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wide">
              Journal / Publisher Venue
            </label>
            <input
              type="text"
              placeholder="e.g. IEEE Access / Springer Nature"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
            />
          </div>
        )}

        {/* Unit Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Associated Research Unit
          </label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          >
            <option value="">Select Research Unit (None)</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title}
              </option>
            ))}
          </select>
        </div>

        {/* PDF Link */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wide">
            PDF Document URL (Full Text Access)
          </label>
          <input
            type="url"
            value={pdf}
            onChange={(e) => setPdf(e.target.value)}
            placeholder="e.g. https://arxiv.org/pdf/..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Description / Abstract */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Abstract / Description Text
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a short summary, abstract text, or findings outline of this research..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-750 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-32"
          ></textarea>
        </div>

      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading || !title}
          className="flex items-center space-x-2 px-6 py-3 bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Submit Proposal Draft</span>
        </button>
      </div>

    </form>
  );
}
