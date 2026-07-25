'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchFromBackend } from '../lib/api';

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
  onSuccess?: () => void;
}

export default function EquipmentFeedbackForm({ equipmentList, sessionUser, onSuccess }: Props) {
  const [equipmentId, setEquipmentId] = useState(equipmentList[0]?.id || '');
  const [userName, setUserName] = useState(sessionUser?.name || '');
  const [userEmail, setUserEmail] = useState(sessionUser?.email || '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [benefitStatement, setBenefitStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!equipmentId || !userName.trim() || !userEmail.trim() || !benefitStatement.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      await fetchFromBackend('/api/labs/feedback', {
        method: 'POST',
        body: JSON.stringify({
          equipmentId,
          userName: userName.trim(),
          userEmail: userEmail.trim(),
          rating,
          benefitStatement: benefitStatement.trim()
        })
      });

      setSuccess(true);
      setBenefitStatement('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback experience.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2">
          <MessageSquarePlus className="w-5 h-5 text-[var(--primary-maroon)]" />
          <span>Submit Scientific Impact Story</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Share how this equipment contributed to your research or academic findings. Approved reviews are featured publicly.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-start space-x-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Thank you for sharing your experience!</p>
            <p className="text-green-700 mt-0.5">Your impact story has been submitted for administrator review.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Target Equipment */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Equipment *
          </label>
          <select
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:ring-2 focus:ring-[var(--primary-maroon)] outline-none"
          >
            {equipmentList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            Rating Experience *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-slate-500 ml-2">{rating} / 5 Stars</span>
          </div>
        </div>

        {/* Name & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="e.g. Dr. Polla Fattah"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:ring-2 focus:ring-[var(--primary-maroon)] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Email *
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="name@su.edu.krd"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:ring-2 focus:ring-[var(--primary-maroon)] outline-none"
            />
          </div>
        </div>

        {/* Benefit Statement / Story */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            Research Benefit Statement / Impact Story *
          </label>
          <textarea
            rows={4}
            value={benefitStatement}
            onChange={(e) => setBenefitStatement(e.target.value)}
            required
            placeholder="Describe how this equipment facilitated your experimental procedure, dataset collection, or paper publication..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:ring-2 focus:ring-[var(--primary-maroon)] outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--primary-maroon)] text-white hover:opacity-90 font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Story...</span>
            </>
          ) : (
            <span>Submit Impact Story for Moderation</span>
          )}
        </button>
      </form>
    </div>
  );
}
