'use server';

import { revalidatePath } from 'next/cache';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function submitReservation(data: {
  equipmentId: string;
  userName: string;
  userEmail: string;
  userType: string;
  purpose: string;
  startTime: string;
  endTime: string;
}) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/labs/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit reservation request.');
    }

    revalidatePath(`/labs/${data.equipmentId}`);
    return await res.json();
  } catch (error: any) {
    console.error('Server Action submitReservation failed:', error);
    throw error;
  }
}

export async function submitFeedback(data: {
  reservationId?: number | null;
  equipmentId: string;
  userName: string;
  userEmail: string;
  rating: number;
  benefitStatement: string;
}) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/labs/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit feedback.');
    }

    revalidatePath(`/labs/${data.equipmentId}`);
    return await res.json();
  } catch (error: any) {
    console.error('Server Action submitFeedback failed:', error);
    throw error;
  }
}

export async function updateReservationStatus(
  reservationId: number,
  status: 'approved' | 'rejected' | 'completed',
  approvedById?: string | null,
  rejectionReason?: string | null
) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/labs/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        approvedById,
        rejectionReason,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update reservation.');
    }

    revalidatePath('/admin/labs');
    return await res.json();
  } catch (error: any) {
    console.error('Server Action updateReservationStatus failed:', error);
    throw error;
  }
}
