import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  role: text('role', { enum: ['student', 'admin', 'super_admin'] }).notNull().default('student'),
  isApproved: integer('is_approved', { mode: 'boolean' }).notNull().default(false),
  clubId: text('club_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Clubs table
export const clubs = sqliteTable('clubs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category', { 
    enum: ['Academic', 'Arts', 'Business', 'Community Service', 'Cultural', 'Hobbies', 'STEM', 'Sports', 'Leadership', 'Other'] 
  }).notNull(),
  advisorName: text('advisor_name').notNull(),
  presidentName: text('president_name').notNull(),
  presidentEmail: text('president_email').notNull(),
  email: text('email').notNull(),
  meetingFrequency: text('meeting_frequency', { enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Varies'] }).notNull(),
  meetingDay: text('meeting_day'),
  meetingTime: text('meeting_time'),
  meetingLocation: text('meeting_location'),
  imageUrl: text('image_url'),
  memberCount: integer('member_count').notNull().default(0),
  yearFounded: integer('year_founded').notNull().default(0),
  requirements: text('requirements'),
  instagramUrl: text('instagram_url'),
  discordUrl: text('discord_url'),
  websiteUrl: text('website_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Club tags (many-to-many relationship)
export const clubTags = sqliteTable('club_tags', {
  id: text('id').primaryKey(),
  clubId: text('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
});

// Club meetings
export const clubMeetings = sqliteTable('club_meetings', {
  id: text('id').primaryKey(),
  clubId: text('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // ISO date string
  startTime: text('start_time').notNull(), // Format: "14:30"
  endTime: text('end_time').notNull(), // Format: "16:00"
  location: text('location').notNull(),
  description: text('description'),
  cancelled: integer('cancelled', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

// Club events
export const clubEvents = sqliteTable('club_events', {
  id: text('id').primaryKey(),
  clubId: text('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  location: text('location'),
  createdAt: text('created_at').notNull(),
});

// User favorites (many-to-many relationship)
export const userFavorites = sqliteTable('user_favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clubId: text('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(),
});

// Admin notifications
export const adminNotifications = sqliteTable('admin_notifications', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  userName: text('user_name'),
  userEmail: text('user_email'),
  clubId: text('club_id').references(() => clubs.id, { onDelete: 'cascade' }),
  clubName: text('club_name'),
  message: text('message'),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  favorites: many(userFavorites),
  managedClub: one(clubs, {
    fields: [users.clubId],
    references: [clubs.id],
  }),
}));

export const clubsRelations = relations(clubs, ({ many }) => ({
  tags: many(clubTags),
  meetings: many(clubMeetings),
  events: many(clubEvents),
  favorites: many(userFavorites),
}));

export const clubTagsRelations = relations(clubTags, ({ one }) => ({
  club: one(clubs, {
    fields: [clubTags.clubId],
    references: [clubs.id],
  }),
}));

export const clubMeetingsRelations = relations(clubMeetings, ({ one }) => ({
  club: one(clubs, {
    fields: [clubMeetings.clubId],
    references: [clubs.id],
  }),
}));

export const clubEventsRelations = relations(clubEvents, ({ one }) => ({
  club: one(clubs, {
    fields: [clubEvents.clubId],
    references: [clubs.id],
  }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [userFavorites.clubId],
    references: [clubs.id],
  }),
}));

export const adminNotificationsRelations = relations(adminNotifications, ({ one }) => ({
  user: one(users, {
    fields: [adminNotifications.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [adminNotifications.clubId],
    references: [clubs.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
export type ClubMeeting = typeof clubMeetings.$inferSelect;
export type NewClubMeeting = typeof clubMeetings.$inferInsert;
export type ClubEvent = typeof clubEvents.$inferSelect;
export type NewClubEvent = typeof clubEvents.$inferInsert;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type NewUserFavorite = typeof userFavorites.$inferInsert;
export type AdminNotification = typeof adminNotifications.$inferSelect;
export type NewAdminNotification = typeof adminNotifications.$inferInsert;