'use server';

import { revalidatePath } from 'next/cache';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function updateStaffProfile(
  staffId: string,
  data: {
    title: string;
    subtitle?: string | null;
    titlePosition?: string | null;
    email?: string | null;
    orcid?: string | null;
    googleScholar?: string | null;
    scopus?: string | null;
    researchgate?: string | null;
    personalWebsite?: string | null;
    bio?: string | null;
    description?: string | null;
    researchAreas: string[];
  }
) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/staff/${staffId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update researcher profile.');
    }

    // Trigger path revalidation for static lists and detail page
    revalidatePath(`/staff/${staffId}`);
    revalidatePath('/staff');
    revalidatePath('/admin/dashboard');
    return await res.json();
  } catch (error: any) {
    console.error('Server Action updateStaffProfile failed:', error);
    throw error;
  }
}
