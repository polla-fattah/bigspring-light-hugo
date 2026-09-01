'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Calendar, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  Award, 
  Quote, 
  Star 
} from 'lucide-react';
import { submitReservation } from '../actions';
import { getEquipmentImageUrl } from '@/lib/equipmentImage';

interface EquipmentReservation {
  id: number;
  userName: string;
  userType: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Equipment {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  image?: string | null;
  status: string;
  workingUnits: number;
  outOfOrder: number;
  totalUnits: number;
  model: string | null;
  specifications: string[];
  reservations?: EquipmentReservation[];
}

interface FeedbackReview {
  id: number;
  userName: string;
  userEmail: string;
  rating: number;
  benefitStatement: string;
  createdAt: string;
  equipment: {
    id: string;
    name: string;
  };
}

interface Props {
  equipmentList: Equipment[];
  approvedFeedbacks: FeedbackReview[];
  sessionUser: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function LabEquipmentInventoryClient({ equipmentList, approvedFeedbacks, sessionUser }: Props) {
  // Modal state
  const [selectedEquipmentForModal, setSelectedEquipmentForModal] = useState<Equipment | null>(null);
  
  // Form fields
  const [userType, setUserType] = useState('student');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const openBookingModal = (eq: Equipment) => {
    setSelectedEquipmentForModal(eq);
    setError('');
    setSuccess(false);
    setStartTime('');
    setEndTime('');
    setPurpose('');
  };

  const closeModal = () => {
    setSelectedEquipmentForModal(null);
    setError('');
    setSuccess(false);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipmentForModal) return;

    setError('');
    setSuccess(false);

    if (!startTime || !endTime || !purpose.trim()) {
      setError('Please fill in all date, time, and purpose fields.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start.getTime() < Date.now()) {
      setError('Reservation start time must be in the future.');
      return;
    }

    if (end.getTime() <= start.getTime()) {
      setError('End time must be strictly after start time.');
      return;
    }

    setLoading(true);

    try {
      const res = await submitReservation({
        equipmentId: selectedEquipmentForModal.id,
        userName: sessionUser?.name || 'Academic Researcher',
        userEmail: sessionUser?.email || 'researcher@su.edu.krd',
        userType: (sessionUser as any)?.role || 'researcher',
        purpose,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit appointment request.');
    } finally {
      setLoading(false);
    }
  };

  const currentMinTime = new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="space-y-8">
      
      {/* Equipment Inventory Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-sm font-extrabold text-[var(--secondary-blue)] flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[var(--primary-maroon)]" />
            <span>Equipment Inventory ({equipmentList.length})</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            Click "Make Appointment" on any instrument below
          </span>
        </div>

        {equipmentList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Settings className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-semibold">No equipment items registered inside this laboratory facility.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {equipmentList.map((eq) => (
              <div 
                key={eq.id} 
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[var(--primary-maroon)] transition-all space-y-4 group" 
                id={`equipment-${eq.id}`}
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  
                  {/* Equipment Thumbnail */}
                  <div className="w-full sm:w-44 h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative">
                    <img 
                      src={getEquipmentImageUrl(eq.image, eq.name, eq.description)} 
                      alt={eq.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase shadow-xs ${
                      eq.status === 'available'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {eq.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-extrabold text-[var(--secondary-blue)] group-hover:text-[var(--primary-maroon)] transition-colors">
                          {eq.name}
                        </h4>
                        {eq.model && (
                          <span className="inline-block text-[10px] font-bold text-slate-400 mt-0.5">
                            Model: <span className="text-slate-600 font-semibold">{eq.model}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                        Qty: {eq.totalUnits}
                      </span>
                    </div>

                    {eq.description && (
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {eq.description}
                      </p>
                    )}

                    {/* Specifications Pills */}
                    {eq.specifications && eq.specifications.length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Technical Specifications:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {eq.specifications.map((spec, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                              • {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action CTA Bar */}
                    <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Status: <strong className="text-slate-700 capitalize">{eq.status}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => openBookingModal(eq)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold sue-btn-primary shadow-sm inline-flex items-center space-x-2 hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Make Appointment</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Appointment Booking Modal */}
      {selectedEquipmentForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--accent-gold)]">
                  Facility Reservation Request
                </span>
                <h3 className="text-lg font-extrabold text-[var(--secondary-blue)] leading-snug">
                  {selectedEquipmentForModal.name}
                </h3>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!sessionUser ? (
              <div className="space-y-4 py-4 text-center">
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  Authentication is required to request an appointment for <strong>{selectedEquipmentForModal.name}</strong>.
                </p>
                <Link 
                  href="/admin/login"
                  className="w-full sue-btn-primary py-3 rounded-xl text-xs font-bold block text-center shadow-sm"
                >
                  Login to Portal to Complete Appointment
                </Link>
              </div>
            ) : success ? (
              <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <h4 className="text-sm font-extrabold text-green-900">Appointment Request Submitted!</h4>
                <p className="text-xs text-green-700 leading-relaxed">
                  Your reservation request for <strong>{selectedEquipmentForModal.name}</strong> has been received and routed to laboratory supervisors.
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700"
                >
                  Close Modal
                </button>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      min={currentMinTime}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      min={startTime || currentMinTime}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Research Purpose / Experiment Description</label>
                  <textarea
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Briefly state your experimental objectives and sample parameters..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold sue-btn-primary shadow-sm inline-flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                    <span>Confirm Appointment Request</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
