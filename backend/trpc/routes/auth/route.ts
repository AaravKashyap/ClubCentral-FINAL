import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../../create-context';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { generateToken, hashPassword, comparePassword } from '../../../lib/auth';

export const loginProcedure = publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }))
  .mutation(async ({ input, ctx }) => {
    const { email, password } = input;

    // Find user by email
    const user = await ctx.db.select().from(users).where(eq(users.email, email.toLowerCase())).get();

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Check password for users with password hash
    if (user.passwordHash) {
      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }
    }

    // Check if user is approved
    if (!user.isApproved) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Your account is pending approval from a super admin',
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clubId: user.clubId,
        isApproved: user.isApproved,
        createdAt: user.createdAt,
      },
    };
  });

export const signupProcedure = publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    role: z.enum(['student', 'admin']),
    clubId: z.string().optional(),
    clubName: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { email, password, name, role, clubId } = input;

    // Check if user already exists
    const existingUser = await ctx.db.select().from(users).where(eq(users.email, email.toLowerCase())).get();

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists',
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      passwordHash,
      role,
      isApproved: role === 'student', // Students are auto-approved, admins need approval
      clubId: clubId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await ctx.db.insert(users).values(newUser);

    // Generate JWT token for students (they're auto-approved)
    let token = null;
    if (role === 'student') {
      token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
    }

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        clubId: newUser.clubId,
        isApproved: newUser.isApproved,
        createdAt: newUser.createdAt,
      },
      message: role === 'admin' ? 'Account created. Waiting for admin approval.' : 'Account created successfully.',
    };
  });

export const meProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const user = await ctx.db.select().from(users).where(eq(users.id, ctx.user.userId)).get();

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clubId: user.clubId,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
    };
  });