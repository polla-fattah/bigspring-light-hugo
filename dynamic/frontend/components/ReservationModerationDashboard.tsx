'use client';

import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle, Search, Download } from 'lucide-react';
import ReservationModerationRow from './ReservationModerationRow';

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
  initialReservations: Reservation[];
  supervisorId: string | null;
}

export default function ReservationModerationDashboard({ initialReservations, supervisorId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const exportUrl = `${backendUrl}/api/labs/reservations/export`;

  // Get unique equipment names for dropdown filter
  const uniqueEquipment = useMemo(() => {
    const names = new Set<string>();
    initialReservations.forEach((r) => {
      if (r.equipment?.name) {
        names.add(r.equipment.name);
      }
    });
    return Array.from(names).sort();
  }, [initialReservations]);

  // Filter reservations based on search query and selected equipment
  const filteredReservations = useMemo(() => {
    return initialReservations.filter((r) => {
      const matchesSearch = 
        r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.equipment?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEquipment = 
        !selectedEquipment || r.equipment?.name === selectedEquipment;

      return matchesSearch && matchesEquipment;
    });
  }, [initialReservations, searchQuery, selectedEquipment]);

  const pendingList = filteredReservations.filter(r => r.status === 'pending');
  const actionedList = filteredReservations.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="flex-1 relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-455 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent transition-all"
            placeholder="Search submitter name, email, or equipment..."
          />
        </div>

        {/* Equipment Selector */}
        <div className="w-full md:w-64">
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-650 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all"
          >
            <option value="">Filter by Equipment (All)</option>
            {uniqueEquipment.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* CSV Export Button */}
        <div>
          <a
            href={exportUrl}
            download
            className="flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all text-center cursor-pointer min-h-[38px]"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </a>
        </div>

      </div>

      {/* Grid Layout for Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Pending Queue Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2 text-[var(--secondary-blue)]">
            <Clock className="w-5 h-5 text-[var(--primary-maroon)]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              Pending Queue ({pendingList.length})
            </h3>
          </div>

          {pendingList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-400 font-medium italic shadow-sm">
              All requests moderated. The pending reservation queue is currently empty.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingList.map((res) => (
                <ReservationModerationRow 
                  key={res.id} 
                  reservation={res} 
                  supervisorId={supervisorId} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Actioned / History Queue Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-2 text-[var(--secondary-blue)]">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              Moderation Log & History ({actionedList.length})
            </h3>
          </div>

          {actionedList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-400 font-medium italic shadow-sm">
              No past reservation records are present in history logs.
            </div>
          ) : (
            <div className="space-y-4">
              {actionedList.slice(0, 15).map((res) => (
                <ReservationModerationRow 
                  key={res.id} 
                  reservation={res} 
                  supervisorId={supervisorId} 
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
