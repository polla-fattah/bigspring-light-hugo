import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, ArrowLeft, Settings, ShieldCheck, Calendar, Info, Star, Quote, Award } from 'lucide-react';
import { fetchFromBackend } from '../../../lib/api';
import { auth } from '../../../auth';
import EquipmentBookingForm from '../../../components/EquipmentBookingForm';
import EquipmentFeedbackForm from '../../../components/EquipmentFeedbackForm';
import CancerBiologyPlatforms from '../../../components/CancerBiologyPlatforms';
import LabEquipmentInventoryClient from './LabEquipmentInventoryClient';
import { getEquipmentImageUrl } from '@/lib/equipmentImage';
import { getLabImageUrl } from '@/lib/imageResolver';

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
  platforms?: string[];
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
            {detail.departmentName && (
              <span className="inline-block px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-maroon-50 text-[var(--primary-maroon)] border border-maroon-100/60 tracking-wider">
                {detail.departmentName}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
              {detail.title.replace(/\s*[–-]\s*lab\s*\d+/gi, '').replace(/\s*[–-]\s*lab\d+/gi, '').trim()}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              {detail.description || 'No detailed instructions exist for this lab facilities profile.'}
            </p>
            
            {/* Lab Research Platforms Badges */}
            {detail.platforms && detail.platforms.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Specialized Research Platforms:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detail.platforms.map((plat, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-maroon-50 text-[var(--primary-maroon)] border border-maroon-100/60">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[var(--primary-maroon)]" />
                      {plat}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
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

          {/* Supervisor Card & Lab Cover Banner */}
          <div className="lg:col-span-4 space-y-4">
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img 
                src={getLabImageUrl(detail.image, detail.title)} 
                alt={detail.title} 
                className="w-full h-full object-cover"
              />
            </div>

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

        {/* Render Cancer Biology Capabilities if this is Cancer Biology Laboratory */}
        {(detail.id === 'cancer-biology' || detail.id === 'cancer-biology-laboratory' || detail.title.toLowerCase().includes('cancer biology')) && (
          <CancerBiologyPlatforms />
        )}

        {/* Equipment listing and Sticky Interactive Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Equipment Inventory Listing & Impact Stories */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Interactive Equipment Inventory Client with Appointment Modal */}
            <LabEquipmentInventoryClient 
              equipmentList={detail.equipment} 
              approvedFeedbacks={approvedFeedbacks} 
              sessionUser={session?.user || null} 
            />

          </div>

          {/* Right Column: Sticky Booking Panel & Feedback Form */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <EquipmentBookingForm equipmentList={detail.equipment} sessionUser={session?.user || null} />

            {detail.equipment.length > 0 && (
              <EquipmentFeedbackForm equipmentList={detail.equipment} sessionUser={session?.user || null} />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

