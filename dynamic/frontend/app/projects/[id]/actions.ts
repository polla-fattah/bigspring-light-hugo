'use server';

import { revalidatePath } from 'next/cache';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function postDiscussionMessage(projectId: string, senderId: string, message: string) {
  if (!projectId || !senderId || !message.trim()) {
    throw new Error('All fields are required.');
  }

  try {
    const res = await fetch(`${BACKEND_API_URL}/api/projects/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        message: message.trim(),
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to post message.');
    }

    // Revalidate the project details page to trigger a fresh data fetch on next request
    revalidatePath(`/projects/${projectId}`);
  } catch (error: any) {
    console.error('Server Action Error posting message:', error);
    throw error;
  }
}
