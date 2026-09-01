'use client';

import { getEquipmentImageUrl } from '@/lib/equipmentImage';
import { getLabImageUrl } from '@/lib/imageResolver';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Settings, 
  Layers, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  category: string | null;
  status: string;
  image?: string | null;
  totalUnits: number;
  model?: string | null;
}

interface Lab {
  id: string;
  title: string;
  image?: string | null;
  shortName: string | null;
  location: string | null;
  locationName: string | null;
  department: string | null;
  departmentName: string | null;
  category: string | null;
  categoryName: string | null;
  description: string | null;
  contact: string | null;
  capacity: string | null;
  status: string;
  equipment: Equipment[];
  supervisor: {
    id: string;
    title: string;
    email: string | null;
  } | null;
}

interface Props {
  initialLabs: Lab[];
}

export default function LabsExplorerClient({ initialLabs }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Labs based on Search Query (Lab title, department, location, or equipment name)
  const filteredLabs = useMemo(() => {
    if (!searchQuery.trim()) return initialLabs;
    const q = searchQuery.toLowerCase();
    return initialLabs.filter(lab => 
      lab.title.toLowerCase().includes(q) ||
      (lab.departmentName && lab.departmentName.toLowerCase().includes(q)) ||
      (lab.locationName && lab.locationName.toLowerCase().includes(q)) ||
      lab.equipment.some(eq => eq.name.toLowerCase().includes(q) || (eq.category && eq.category.toLowerCase().includes(q)))
    );
  }, [initialLabs, searchQuery]);

  // Extract all matching equipment for direct equipment search results
  const matchingEquipment = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { lab: Lab; equipment: Equipment }[] = [];
    
    initialLabs.forEach(lab => {
      lab.equipment.forEach(eq => {
        if (eq.name.toLowerCase().includes(q) || (eq.category && eq.category.toLowerCase().includes(q)) || (eq.model && eq.model.toLowerCase().includes(q))) {
          results.push({ lab, equipment: eq });
        }
      });
    });
    return results;
  }, [initialLabs, searchQuery]);

  return (
    <div className="space-y-12">
      
      {/* 1. Page Header (Without "Specialized Facilities" badge as requested) */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary-blue)] tracking-tight">
          Research Laboratories & Equipment
        </h1>

        {/* Real-time Interactive Search Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative rounded-2xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by laboratory name, department, or equipment (e.g. Conductivity Meter, PCR)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-extrabold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Direct Matching Equipment Section (Appears when searching specific equipment) */}
      {searchQuery && matchingEquipment.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-3xl p-8 border border-amber-200/80 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-[var(--secondary-blue)] border-b border-amber-200/60 pb-3">
            <Settings className="w-5 h-5 text-[var(--primary-maroon)]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">
              Matching Equipment Inventory Results ({matchingEquipment.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingEquipment.map(({ lab, equipment }) => (
              <div key={`${lab.id}-${equipment.id}`} className="bg-white rounded-2xl p-5 border border-amber-150 shadow-xs space-y-3 flex flex-col justify-between">
                
                {/* Equipment Cover Image / Placeholder */}
                <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                  <img 
                    src={getEquipmentImageUrl(equipment.image, equipment.name, (equipment as any).description || '')} 
                    alt={equipment.name}
                    className="w-full h-full object-cover" 
                  />
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    equipment.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {equipment.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-[var(--secondary-blue)] line-clamp-1">{equipment.name}</h4>
                  {equipment.model && <p className="text-[10px] text-slate-400 font-semibold">Model: {equipment.model}</p>}
                  <p className="text-[10px] font-bold text-[var(--accent-gold)] uppercase tracking-wider truncate">
                    Lab: {lab.title}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Qty: {equipment.totalUnits}</span>
                  <Link 
                    href={`/labs/${lab.id}#equipment-${equipment.id}`}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-[var(--primary-maroon)] text-white hover:bg-red-900 inline-flex items-center space-x-1 shadow-xs"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Laboratories Grid (Clean Two-Step Cards) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            All Research Laboratories ({filteredLabs.length})
          </h3>
          {searchQuery && (
            <span className="text-xs text-slate-500 font-semibold">
              Showing results for "{searchQuery}"
            </span>
          )}
        </div>

        {filteredLabs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <p className="text-xs text-slate-500 font-bold">No laboratories or equipment matched your search query.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLabs.map((lab) => {
              // Clean lab title: remove " - Lab 33", " - Lab 10", " - lab 8", etc.
              const cleanedTitle = lab.title
                .replace(/\s*[–-]\s*lab\s*\d+/gi, '')
                .replace(/\s*[–-]\s*lab\d+/gi, '')
                .trim();

              const deptLabel = lab.departmentName || lab.department || 'Research Laboratory';

              return (
                <div 
                  key={lab.id} 
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[var(--primary-maroon)] hover:shadow-md transition-all group"
                >
                  
                  <div className="space-y-4">
                    {/* Laboratory Cover Image Banner */}
                    <div className="h-40 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative mb-4">
                      <img 
                        src={getLabImageUrl(lab.image, lab.title)} 
                        alt={lab.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Top Pill: Department/Faculty Label (Replaces the Active Chip) */}
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="inline-block px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-maroon-50 text-[var(--primary-maroon)] border border-maroon-100/60 tracking-wider">
                        {deptLabel}
                      </span>
                    </div>

                    {/* Cleaned Real Main Title */}
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-[var(--secondary-blue)] leading-snug group-hover:text-[var(--primary-maroon)] transition-colors">
                        <Link href={`/labs/${lab.id}`}>
                          {cleanedTitle}
                        </Link>
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                      {lab.description || 'Laboratory facility equipped for scientific research and experimental activities.'}
                    </p>

                    {/* Metadata Section: Location, Supervisor, & Equipment Count Brought Down */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600 font-semibold">
                      {lab.locationName && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0 mt-0.5" />
                          <span className="truncate">{lab.locationName}</span>
                        </div>
                      )}
                      {lab.supervisor && (
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-[var(--primary-maroon)] flex-shrink-0" />
                          <span className="truncate">
                            Supervisor: <span className="text-[var(--secondary-blue)] font-bold">{lab.supervisor.title}</span>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-slate-500 font-bold">
                        <Settings className="w-4 h-4 text-[var(--accent-gold)] flex-shrink-0" />
                        <span>{lab.equipment.length} Equipment Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 -> Step 2 Action Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link 
                      href={`/labs/${lab.id}`}
                      className="w-full sue-btn-primary py-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span>View Lab & Equipment Inventory</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
