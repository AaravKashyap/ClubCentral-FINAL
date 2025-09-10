import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // Check for explicit environment variable first
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // For web development, check if we're running locally
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    
    // If running on localhost or development server
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('ngrok')) {
      // Check if backend is running on port 3000
      return `${protocol}//${hostname}:3000`;
    }
    
    // For production web, use current origin
    return window.location.origin;
  }

  // For development (Node.js environment)
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Fallback for server-side rendering
  return 'https://your-app-domain.com';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});