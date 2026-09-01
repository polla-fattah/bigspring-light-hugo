import React from 'react';
import { fetchFromBackend } from '../../lib/api';
import LabsExplorerClient from './LabsExplorerClient';

interface Equipment {
  id: string;
  name: string;
  category: string | null;
  status: string;
  image?: string | null;
  totalUnits: number;
}

interface Lab {
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

export default async function LabsPage() {
  let labsList: Lab[] = [];

  try {
    labsList = await fetchFromBackend<Lab[]>('/api/labs');
  } catch (err) {
    console.error('Could not load specialized laboratories directory:', err);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LabsExplorerClient initialLabs={labsList} />
      </div>
    </div>
  );
}
