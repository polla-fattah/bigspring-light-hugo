'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import DragDropImageUpload from '@/components/DragDropImageUpload';
import { createProjectDraft } from '../actions';

interface Unit {
  id: string;
  title: string;
}

interface Props {
  units: Unit[];
  staffId: string;
}

export default function ProjectSubmitForm({ units, staffId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form Fields State
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [projectType, setProjectType] = useState('Funded Research');
  const [unitId, setUnitId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProjectDraft({
        title,
        status,
        year: year ? String(year) : '',
        projectType: projectType || '',
        unitId,
        description,
        creatorStaffId: staffId,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while submitting project proposal.');
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
          Your project draft has been saved. The site administrators will review and catalog it shortly. Redirecting you to the dashboard...
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
            Project Name / Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Kurdish handwritten character recognition using deep learning models"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Status Selection */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Current Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Year */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wide">
            Commencement Year
          </label>
          <input
            type="number"
            min="1990"
            max={new Date().getFullYear() + 2}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Project Type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-455 uppercase tracking-wide">
            Project Type / Class
          </label>
          <input
            type="text"
            placeholder="e.g. Grant Funded / International Collaboration"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Unit Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Lead Research Unit *
          </label>
          <select
            required
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          >
            <option value="">Select Lead Research Unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title}
              </option>
            ))}
          </select>
        </div>

        {/* Description / Summary */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
            Project Objectives & Summary
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline the core goals, methodology, and primary partners involved in this project..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-750 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-32"
          ></textarea>
        </div>

        {/* Project Image / Cover */}
        <div className="md:col-span-2">
          <DragDropImageUpload
            label="Project Diagram / Cover Image"
            description="Drag & drop a diagram or cover image for this research project."
            value={image}
            onChange={(val) => setImage(val)}
          />
        </div>

      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading || !title || !unitId}
          className="flex items-center space-x-2 px-6 py-3 bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Submit Proposal Draft</span>
        </button>
      </div>

    </form>
  );
}
