function getBackendApiUrl(): string {
  // Server-side (Node.js SSR / Server Components): connect to local backend on port 3000
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_BACKEND_URL || 'http://127.0.0.1:3000';
  }
  // Client-side (User Browser): use relative URL so Nginx proxies /api/ requests
  return process.env.NEXT_PUBLIC_API_URL || '';
}

export async function fetchFromBackend<T>(
  endpoint: string,
  options?: RequestInit,
  fallbackValue?: T
): Promise<T> {
  const baseUrl = getBackendApiUrl();
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      next: { revalidate: 300 }, // Cache response for 5 minutes (ISR)
      ...options
    });

    if (!res.ok) {
      console.warn(`[Backend Notice] Non-200 response on ${endpoint}: Status ${res.status}`);
      if (fallbackValue !== undefined) return fallbackValue;
      throw new Error(`Failed to fetch from backend (Endpoint: ${endpoint}, Status: ${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Backend Connection Notice] Could not reach backend API at ${endpoint}.`);
    if (fallbackValue !== undefined) return fallbackValue;
    throw error;
  }
}
