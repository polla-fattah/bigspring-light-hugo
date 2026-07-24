'use server';

import { revalidatePath } from 'next/cache';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function updateSystemSettings(settings: Record<string, string>) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update system settings.');
    }

    revalidatePath('/');
    return await res.json();
  } catch (error: any) {
    console.error('Server Action updateSystemSettings failed:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: 'superadmin' | 'lab_staff' | 'researcher') {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update user role.');
    }

    revalidatePath('/admin/super');
    return await res.json();
  } catch (error: any) {
    console.error('Server Action updateUserRole failed:', error);
    throw error;
  }
}

export async function toggleContentPublishState(
  entityType: string,
  entityId: string | number,
  draft: boolean
) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/content/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entityType,
        entityId,
        draft,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to toggle content draft status.');
    }

    // Revalidate relevant pages dynamically
    revalidatePath('/admin/super');
    revalidatePath(`/${entityType}s`);
    revalidatePath(`/${entityType}s/${entityId}`);
    return await res.json();
  } catch (error: any) {
    console.error('Server Action toggleContentPublishState failed:', error);
    throw error;
  }
}
