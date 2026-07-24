'use server';

import { revalidatePath } from 'next/cache';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function createProjectDraft(data: {
  title: string;
  description: string;
  status: string;
  unitId: string;
  year: string;
  projectType: string;
  creatorStaffId: string;
}) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit project proposal.');
    }

    revalidatePath('/projects');
    revalidatePath('/admin/dashboard');
    return await res.json();
  } catch (error: any) {
    console.error('Server Action createProjectDraft failed:', error);
    throw error;
  }
}

export async function createPublicationDraft(data: {
  title: string;
  pubType: string;
  degree?: string | null;
  year?: string | null;
  unitId?: string | null;
  description?: string | null;
  pdf?: string | null;
  journal?: string | null;
  creatorStaffId: string;
}) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/publications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit publication proposal.');
    }

    revalidatePath('/publications');
    revalidatePath('/admin/dashboard');
    return await res.json();
  } catch (error: any) {
    console.error('Server Action createPublicationDraft failed:', error);
    throw error;
  }
}
