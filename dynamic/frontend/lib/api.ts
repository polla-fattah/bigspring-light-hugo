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
  const isServer = typeof window === 'undefined';

  // Server gets revalidate: 300 (ISR), Browser gets standard fetch options
  const defaultOptions: RequestInit = isServer 
    ? { next: { revalidate: 300 } } as any 
    : { cache: 'no-store' };

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...defaultOptions,
      ...options
    });

    if (!res.ok) {
      console.warn(`[Backend Notice] Non-200 response on ${endpoint}: Status ${res.status}`);
      if (fallbackValue !== undefined) return fallbackValue;
      return [] as unknown as T;
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Backend Connection Notice] Could not reach backend API at ${endpoint}.`, error);
    if (fallbackValue !== undefined) return fallbackValue;
    return [] as unknown as T;
  }
}
