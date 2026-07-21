const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchFromBackend<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      next: { revalidate: 300 }, // Cache response for 5 minutes (ISR)
      ...options
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from backend (Endpoint: ${endpoint}, Status: ${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch error on endpoint ${endpoint}:`, error);
    throw error;
  }
}
