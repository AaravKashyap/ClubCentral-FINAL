import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// Mock user for authentication (in a real app, this would come from JWT/session)
type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'super_admin';
};

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // In a real app, you would extract user from JWT token or session
  // For now, we'll use a mock user
  const mockUser: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'student'
  };
  
  return {
    req: opts.req,
    user: mockUser, // In real app, this would be null if not authenticated
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});