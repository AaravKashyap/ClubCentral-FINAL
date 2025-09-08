import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';

// In-memory storage for club memberships (in a real app, this would be in a database)
const clubMemberships = new Map<string, Set<string>>(); // clubId -> Set of userIds
const userMemberships = new Map<string, Set<string>>(); // userId -> Set of clubIds

export const joinClubProcedure = protectedProcedure
  .input(z.object({
    clubId: z.string(),
  }))
  .mutation(({ input, ctx }) => {
    const { clubId } = input;
    const userId = ctx.user.id;
    
    // Initialize sets if they don't exist
    if (!clubMemberships.has(clubId)) {
      clubMemberships.set(clubId, new Set());
    }
    if (!userMemberships.has(userId)) {
      userMemberships.set(userId, new Set());
    }
    
    // Add user to club
    clubMemberships.get(clubId)!.add(userId);
    userMemberships.get(userId)!.add(clubId);
    
    return { success: true, message: 'Successfully joined club!' };
  });

export const leaveClubProcedure = protectedProcedure
  .input(z.object({
    clubId: z.string(),
  }))
  .mutation(({ input, ctx }) => {
    const { clubId } = input;
    const userId = ctx.user.id;
    
    // Remove user from club
    clubMemberships.get(clubId)?.delete(userId);
    userMemberships.get(userId)?.delete(clubId);
    
    return { success: true, message: 'Successfully left club!' };
  });

export const getUserMembershipsProcedure = protectedProcedure
  .query(({ ctx }) => {
    const userId = ctx.user.id;
    const userClubs = userMemberships.get(userId) || new Set();
    return Array.from(userClubs);
  });

export const getClubMembersProcedure = protectedProcedure
  .input(z.object({
    clubId: z.string(),
  }))
  .query(({ input }) => {
    const { clubId } = input;
    const members = clubMemberships.get(clubId) || new Set();
    return {
      memberCount: members.size,
      memberIds: Array.from(members)
    };
  });

export const isUserMemberProcedure = protectedProcedure
  .input(z.object({
    clubId: z.string(),
  }))
  .query(({ input, ctx }) => {
    const { clubId } = input;
    const userId = ctx.user.id;
    const userClubs = userMemberships.get(userId) || new Set();
    return userClubs.has(clubId);
  });