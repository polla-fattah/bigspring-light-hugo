import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, ArrowLeft, Settings, ShieldCheck, Calendar, Info, Star, Quote, Award } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';
import { auth } from '../../../auth';
import EquipmentBookingForm from '../../../components/EquipmentBookingForm';
import EquipmentFeedbackForm from '../../../components/EquipmentFeedbackForm';

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
  status: string;
  workingUnits: number;
  outOfOrder: number;
  totalUnits: number;
  model: string | null;
  specifications: string[];
  reservations: EquipmentReservation[];
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

interface LabDetail {
  id: string;
  title: string;
  shortName: string | null;
  location: string | null;
  locationName: string | null;
  department: string | null;
  departmentName: string | null;
  category: string | null;
  categoryName: string | null;
  description: string | null;
  image: string | null;
  contact: string | null;
  capacity: string | null;
  status: string;
  equipment: Equipment[];
  supervisor: {
    id: string;
    title: string;
    email: string | null;
    image: string | null;
  } | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LabDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  let detail: LabDetail | null = null;
  let approvedFeedbacks: FeedbackReview[] = [];
  let errorMsg = '';

  try {
    detail = await fetchFromBackend<LabDetail>(`/api/labs/${id}`);
    const allApproved = await fetchFromBackend<FeedbackReview[]>(`/api/labs/feedback?status=approved`);
    
    // Filter feedbacks relevant to equipment inside this lab
    const labEquipmentIds = new Set(detail.equipment.map((e) => e.id));
    approvedFeedbacks = (allApproved || []).filter((fb) => labEquipmentIds.has(fb.equipment?.id));
  } catch (err) {
    errorMsg = 'Could not load laboratory details.';
  }

  if (errorMsg || !detail) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-sm text-red-600 font-bold">{errorMsg || 'Laboratory not found.'}</p>
          <Link href="/labs" className="sue-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold block text-center">
            Back to Labs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link href="/labs" className="text-xs font-bold text-slate-500 hover:text-[var(--primary-maroon)] flex items-center space-x-1.5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Laboratories</span>
          </Link>
        </div>

        {/* Lab Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-green-50 text-green-700 border border-green-100">
              {detail.status.toUpperCase()}
            </span>
            <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
              {detail.title}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              {detail.description || 'No detailed instructions exist for this lab facilities profile.'}
            </p>
            
            {/* Meta values */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-450 pt-2 border-t border-slate-50">
              {detail.locationName && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>{detail.locationName}</span>
                </div>
              )}
              {detail.capacity && (
                <div className="flex items-center space-x-1">
                  <Info className="w-4 h-4 text-[var(--primary-maroon)]" />
                  <span>Capacity: {detail.capacity} researchers</span>
                </div>
              )}
            </div>
          </div>

          {/* Supervisor Card */}
          <div className="lg:col-span-4">
            {detail.supervisor && (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Lab Supervisor
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-[var(--primary-maroon)] flex items-center justify-center font-bold text-xs">
                    {detail.supervisor.title.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--secondary-blue)]">
                      <Link href={`/staff/${detail.supervisor.id}`} className="hover:underline">
                        {detail.supervisor.title}
                      </Link>
                    </h5>
                    {detail.supervisor.email && (
                      <a href={`mailto:${detail.supervisor.email}`} className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5 hover:underline">
                        <Mail className="w-3.5 h-3.5 text-[var(--primary-maroon)]" />
                        <span>{detail.supervisor.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Equipment listing and Interactive Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Equipment items & Impact Stories */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Equipment Listing Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2 border-b border-slate-100 pb-4">
                <Settings className="w-5 h-5 text-[var(--primary-maroon)]" />
                <span>Specialized Equipment Listing ({detail.equipment.length})</span>
              </h3>

              {detail.equipment.length === 0 ? (
                <p className="text-xs text-slate-400">No equipment items registered inside this laboratory.</p>
              ) : (
                <div className="space-y-6">
                  {detail.equipment.map((eq) => (
                    <div key={eq.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-150 space-y-3" id={`equipment-${eq.id}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-extrabold text-[var(--secondary-blue)]">{eq.name}</h4>
                          {eq.model && <p className="text-[10px] text-slate-400 mt-0.5">Model: {eq.model}</p>}
                        </div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          eq.status === 'available'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {eq.status}
                        </span>
                      </div>
                      
                      {eq.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">{eq.description}</p>
                      )}

                      {/* Specifications list */}
                      {eq.specifications && eq.specifications.length > 0 && (
                        <div className="pt-2">
                          <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                            Specifications:
                          </h5>
                          <ul className="list-disc pl-4 text-[10px] text-slate-450 space-y-1">
                            {eq.specifications.map((spec, index) => (
                              <li key={index}>{spec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Public Impact Stories Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[var(--primary-maroon)]" />
                  <span>Scientific Impact Stories & Research Reviews ({approvedFeedbacks.length})</span>
                </h3>
              </div>

              {approvedFeedbacks.length === 0 ? (
                <div className="text-center py-6 text-slate-400 space-y-2">
                  <Quote className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No public impact reviews featured yet for this lab facility.</p>
                  <p className="text-[11px] text-slate-400">Be the first researcher to submit a research benefit story using the form on the right!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {approvedFeedbacks.map((fb) => (
                    <div key={fb.id} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                fb.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] font-bold text-amber-800 ml-1.5">{fb.rating}/5</span>
                        </div>

                        {/* Benefit statement */}
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          "{fb.benefitStatement}"
                        </p>
                      </div>

                      <div className="pt-3 border-t border-amber-200/50 flex justify-between items-center text-[10px]">
                        <div>
                          <span className="font-bold text-[var(--secondary-blue)] block">{fb.userName}</span>
                          <span className="text-slate-400 block">{fb.equipment?.name || 'Lab Equipment'}</span>
                        </div>
                        <span className="text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Block: Booking Panel & Impact Submission Form */}
          <div className="lg:col-span-4 space-y-6">
            <EquipmentBookingForm equipmentList={detail.equipment} sessionUser={session?.user || null} />

            {/* Impact Submission Form */}
            {detail.equipment.length > 0 && (
              <EquipmentFeedbackForm equipmentList={detail.equipment} sessionUser={session?.user || null} />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

