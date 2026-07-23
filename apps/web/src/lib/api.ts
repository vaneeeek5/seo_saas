export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // If running in browser on production server (not localhost)
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}
