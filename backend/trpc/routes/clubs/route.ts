import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../../create-context';
import { clubs, clubTags, clubMeetings, userFavorites } from '../../../db/schema';
import { eq, like, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const getAllClubsProcedure = publicProcedure
  .input(z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ input, ctx }) => {
    const { category, search, limit, offset } = input;

    let query = ctx.db.select().from(clubs);

    // Apply filters
    const conditions = [];
    if (category && category !== 'All') {
      conditions.push(eq(clubs.category, category as any));
    }
    if (search) {
      conditions.push(like(clubs.name, `%${search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const clubsData = await query
      .orderBy(clubs.name)
      .limit(limit)
      .offset(offset)
      .all();

    // Get tags for each club
    const clubsWithTags = await Promise.all(
      clubsData.map(async (club) => {
        const tags = await ctx.db
          .select({ tag: clubTags.tag })
          .from(clubTags)
          .where(eq(clubTags.clubId, club.id))
          .all();

        const meetings = await ctx.db
          .select()
          .from(clubMeetings)
          .where(eq(clubMeetings.clubId, club.id))
          .orderBy(clubMeetings.date)
          .all();

        return {
          ...club,
          tags: tags.map(t => t.tag),
          upcomingMeetings: meetings,
          socialMedia: {
            instagram: club.instagramUrl,
            discord: club.discordUrl,
            website: club.websiteUrl,
          },
        };
      })
    );

    return clubsWithTags;
  });

export const getClubByIdProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const { id } = input;

    const club = await ctx.db.select().from(clubs).where(eq(clubs.id, id)).get();

    if (!club) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Club not found',
      });
    }

    // Get tags
    const tags = await ctx.db
      .select({ tag: clubTags.tag })
      .from(clubTags)
      .where(eq(clubTags.clubId, club.id))
      .all();

    // Get meetings
    const meetings = await ctx.db
      .select()
      .from(clubMeetings)
      .where(eq(clubMeetings.clubId, club.id))
      .orderBy(clubMeetings.date)
      .all();

    return {
      ...club,
      tags: tags.map(t => t.tag),
      upcomingMeetings: meetings,
      socialMedia: {
        instagram: club.instagramUrl,
        discord: club.discordUrl,
        website: club.websiteUrl,
      },
    };
  });

export const getFavoriteClubsProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    const favorites = await ctx.db
      .select({
        club: clubs,
      })
      .from(userFavorites)
      .innerJoin(clubs, eq(userFavorites.clubId, clubs.id))
      .where(eq(userFavorites.userId, ctx.user.userId))
      .all();

    // Get tags for each favorite club
    const clubsWithTags = await Promise.all(
      favorites.map(async ({ club }) => {
        const tags = await ctx.db
          .select({ tag: clubTags.tag })
          .from(clubTags)
          .where(eq(clubTags.clubId, club.id))
          .all();

        const meetings = await ctx.db
          .select()
          .from(clubMeetings)
          .where(eq(clubMeetings.clubId, club.id))
          .orderBy(clubMeetings.date)
          .all();

        return {
          ...club,
          tags: tags.map(t => t.tag),
          upcomingMeetings: meetings,
          socialMedia: {
            instagram: club.instagramUrl,
            discord: club.discordUrl,
            website: club.websiteUrl,
          },
        };
      })
    );

    return clubsWithTags;
  });

export const toggleFavoriteProcedure = protectedProcedure
  .input(z.object({
    clubId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { clubId } = input;

    // Check if already favorited
    const existingFavorite = await ctx.db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, ctx.user.userId),
        eq(userFavorites.clubId, clubId)
      ))
      .get();

    if (existingFavorite) {
      // Remove from favorites
      await ctx.db
        .delete(userFavorites)
        .where(and(
          eq(userFavorites.userId, ctx.user.userId),
          eq(userFavorites.clubId, clubId)
        ));
      
      return { favorited: false };
    } else {
      // Add to favorites
      await ctx.db.insert(userFavorites).values({
        id: `${ctx.user.userId}-${clubId}`,
        userId: ctx.user.userId,
        clubId,
        createdAt: new Date().toISOString(),
      });
      
      return { favorited: true };
    }
  });

export const getUpcomingMeetingsProcedure = publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(50).default(10),
  }))
  .query(async ({ input, ctx }) => {
    const { limit } = input;


    const meetings = await ctx.db
      .select({
        meeting: clubMeetings,
        club: clubs,
      })
      .from(clubMeetings)
      .innerJoin(clubs, eq(clubMeetings.clubId, clubs.id))
      .where(and(
        eq(clubMeetings.cancelled, false),
        // Only future meetings
      ))
      .orderBy(clubMeetings.date, clubMeetings.startTime)
      .limit(limit)
      .all();

    return meetings.map(({ meeting, club }) => ({
      club,
      meeting,
    }));
  });