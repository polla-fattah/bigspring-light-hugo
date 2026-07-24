'use client';

import React, { useState } from 'react';
import { Check, X, Loader2, Calendar, User, FileText, Mail } from 'lucide-react';
import { updateReservationStatus } from '../app/labs/actions';

interface Reservation {
  id: number;
  userName: string;
  userEmail: string;
  userType: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status: string;
  rejectionReason: string | null;
  equipment: {
    id: string;
    name: string;
    lab: {
      id: string;
      title: string;
    } | null;
  } | null;
}

interface Props {
  reservation: Reservation;
  supervisorId: string | null;
}

export default function ReservationModerationRow({ reservation, supervisorId }: Props) {
  const [status, setStatus] = useState(reservation.status);
  const [rejectionReason, setRejectionReason] = useState(reservation.rejectionReason || '');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (newStatus: 'approved' | 'rejected') => {
    setError('');
    setLoading(true);

    try {
      await updateReservationStatus(
        reservation.id,
        newStatus,
        supervisorId,
        newStatus === 'rejected' ? rejectionReason : null
      );
      setStatus(newStatus);
      setShowRejectForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update reservation status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow space-y-4">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">
            {reservation.equipment?.name || 'Unknown Equipment'}
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
            {reservation.equipment?.lab?.title || 'Unknown Laboratory'}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
          status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' :
          status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
          'bg-amber-50 text-amber-700 border border-amber-100'
        }`}>
          {status}
        </span>
      </div>

      {/* Grid of values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium border-t border-slate-100 pt-4">
        
        {/* User details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-655">
            <User className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0" />
            <span className="font-extrabold">{reservation.userName}</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded capitalize">{reservation.userType}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <a href={`mailto:${reservation.userEmail}`} className="hover:underline truncate">{reservation.userEmail}</a>
          </div>
        </div>

        {/* DateTime Range */}
        <div className="space-y-1.5 text-slate-600">
          <div className="flex items-start space-x-2">
            <Calendar className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0 mt-0.5" />
            <div>
              <p>Start: <span className="font-extrabold text-slate-800">{new Date(reservation.startTime).toLocaleString()}</span></p>
              <p className="mt-0.5">End: <span className="font-extrabold text-slate-800">{new Date(reservation.endTime).toLocaleString()}</span></p>
            </div>
          </div>
        </div>

      </div>

      {/* Purpose */}
      <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1">
        <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
          <FileText className="w-3.5 h-3.5" />
          <span>Purpose of Use</span>
        </h5>
        <p className="text-xs text-slate-655 leading-relaxed font-medium">
          {reservation.purpose}
        </p>
      </div>

      {/* Rejection Details Display */}
      {status === 'rejected' && reservation.rejectionReason && (
        <p className="text-xs text-red-600 font-semibold italic bg-red-50 border border-red-150 p-2.5 rounded-lg">
          Reason: {reservation.rejectionReason}
        </p>
      )}

      {/* Error Displays */}
      {error && (
        <p className="text-xs text-red-650 font-bold">
          {error}
        </p>
      )}

      {/* Interactive Controls (For Pending) */}
      {status === 'pending' && !showRejectForm && (
        <div className="flex justify-end space-x-3 pt-2 border-t border-slate-50">
          <button
            onClick={() => handleAction('approved')}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Approve Request</span>
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reject Request</span>
          </button>
        </div>
      )}

      {/* Interactive Rejection Form */}
      {showRejectForm && (
        <div className="pt-3 border-t border-slate-100 space-y-3 animate-fade-in">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wide">
              Provide Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this reservation is rejected (e.g. equipment maintenance, scheduling conflicts)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-20"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleAction('rejected')}
              disabled={loading || !rejectionReason.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => setShowRejectForm(false)}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
