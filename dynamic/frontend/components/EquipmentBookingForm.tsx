'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, CalendarRange, CheckCircle2 } from 'lucide-react';
import { submitReservation } from '../app/labs/actions';

interface EquipmentItem {
  id: string;
  name: string;
}

interface Props {
  equipmentList: EquipmentItem[];
  sessionUser: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function EquipmentBookingForm({ equipmentList, sessionUser }: Props) {
  const [equipmentId, setEquipmentId] = useState('');
  const [userType, setUserType] = useState('student');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!sessionUser) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          Request Facility Reservation
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Authentication is required to submit reservation requests to lab technicians.
        </p>
        <Link 
          href="/admin/login" 
          className="w-full py-3.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl text-xs block text-center transition-all"
        >
          Login to Portal
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!equipmentId || !startTime || !endTime || !purpose.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Future validation
    const minFutureTime = Date.now() + 15 * 60 * 1000;
    if (start.getTime() < minFutureTime) {
      setError('Reservation start time must be at least 15 minutes in the future.');
      return;
    }

    // 2. Chronological check
    if (start >= end) {
      setError('Reservation end time must be after the start time.');
      return;
    }

    // 3. Duration check
    const durationMs = end.getTime() - start.getTime();
    const minDurationMs = 30 * 60 * 1000; // 30 minutes
    const maxDurationMs = 24 * 60 * 60 * 1000; // 24 hours
    if (durationMs < minDurationMs || durationMs > maxDurationMs) {
      setError('Reservation duration must be between 30 minutes and 24 hours.');
      return;
    }

    setLoading(true);

    try {
      await submitReservation({
        equipmentId,
        userName: sessionUser.name || 'SUE Researcher',
        userEmail: sessionUser.email || '',
        userType,
        purpose,
        startTime,
        endTime,
      });

      setSuccess(true);
      setEquipmentId('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking. Please check date conflicts.');
    } finally {
      setLoading(false);
    }
  };

  const currentMinTime = new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center space-x-2">
        <CalendarRange className="w-4 h-4 text-[var(--primary-maroon)]" />
        <span>Request Facility Reservation</span>
      </h3>

      {success && (
        <div className="flex items-start space-x-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-3.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Booking Request Submitted!</p>
            <p className="font-medium text-[10px] text-green-600/80 mt-0.5">Your request is pending supervisor approval.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Select Equipment */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[var(--secondary-blue)]">Select Equipment</label>
          <select 
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-650 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
            required
          >
            <option value="">Choose from inventory...</option>
            {equipmentList.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
            ))}
          </select>
        </div>

        {/* User Type */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[var(--secondary-blue)]">User Category</label>
          <select 
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-650 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          >
            <option value="student">Student Researcher</option>
            <option value="staff">Faculty Staff Member</option>
            <option value="external">External Collaborator</option>
          </select>
        </div>

        {/* Datetime Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-extrabold text-[var(--secondary-blue)]">Start Date/Time</label>
            <input 
              type="datetime-local" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={currentMinTime}
              className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-650 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-extrabold text-[var(--secondary-blue)]">End Date/Time</label>
            <input 
              type="datetime-local" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime || currentMinTime}
              className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs text-slate-650 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
              required 
            />
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-[var(--secondary-blue)]">Purpose of Use</label>
          <textarea 
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Describe your research project objectives and safety protocols..." 
            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-650 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all h-24"
            required
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[var(--primary-maroon)] text-white font-bold rounded-xl shadow-md text-xs hover:bg-[var(--primary-maroon-hover)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <span>Submit Booking Request</span>
          )}
        </button>
      </form>
    </div>
  );
}
