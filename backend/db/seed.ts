import { db } from './index';
import { users, clubs, clubTags, clubMeetings } from './schema';
import { clubs as mockClubs } from '@/mocks/clubs';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default super admin users
    const defaultUsers = [
      {
        id: '1',
        email: 'kashyap3185@mydusd.org',
        name: 'Super Admin',
        passwordHash: await bcrypt.hash('6046AK2008', 10),
        role: 'super_admin' as const,
        isApproved: true,
        clubId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'meadipudi8772@mydusd.org',
        name: 'Asthra',
        passwordHash: await bcrypt.hash('dhsclubs2526', 10),
        role: 'super_admin' as const,
        isApproved: true,
        clubId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'malmgren9480@mydusd.org',
        name: 'Olivia',
        passwordHash: await bcrypt.hash('dhsclubs2526', 10),
        role: 'super_admin' as const,
        isApproved: true,
        clubId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'rosbyelise@dublinusd.org',
        name: 'Elise Rosby',
        passwordHash: await bcrypt.hash('dhsclubs2526', 10),
        role: 'super_admin' as const,
        isApproved: true,
        clubId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Insert users (ignore if they already exist)
    for (const user of defaultUsers) {
      try {
        const existingUser = await db.select().from(users).where(eq(users.email, user.email)).get();
        if (!existingUser) {
          await db.insert(users).values(user);
          console.log(`✅ Created user: ${user.email}`);
        } else {
          console.log(`⏭️  User already exists: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error);
      }
    }

    // Migrate clubs from mock data
    console.log('🏫 Migrating clubs...');
    for (const mockClub of mockClubs) {
      try {
        const existingClub = await db.select().from(clubs).where(eq(clubs.id, mockClub.id)).get();
        if (!existingClub) {
          // Insert club
          const clubData = {
            id: mockClub.id,
            name: mockClub.name,
            description: mockClub.description,
            category: mockClub.category,
            advisorName: mockClub.advisorName,
            presidentName: mockClub.presidentName,
            presidentEmail: mockClub.presidentEmail,
            email: mockClub.email,
            meetingFrequency: mockClub.meetingFrequency,
            meetingDay: mockClub.meetingDay || null,
            meetingTime: mockClub.meetingTime || null,
            meetingLocation: mockClub.meetingLocation || null,
            imageUrl: mockClub.imageUrl,
            memberCount: mockClub.memberCount,
            yearFounded: mockClub.yearFounded,
            requirements: mockClub.requirements || null,
            instagramUrl: mockClub.socialMedia?.instagram || null,
            discordUrl: mockClub.socialMedia?.discord || null,
            websiteUrl: mockClub.socialMedia?.website || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await db.insert(clubs).values(clubData);

          // Insert club tags
          for (const tag of mockClub.tags) {
            await db.insert(clubTags).values({
              id: `${mockClub.id}-${tag}`,
              clubId: mockClub.id,
              tag,
            });
          }

          // Insert club meetings
          for (const meeting of mockClub.upcomingMeetings) {
            await db.insert(clubMeetings).values({
              id: meeting.id,
              clubId: mockClub.id,
              date: meeting.date,
              startTime: meeting.startTime,
              endTime: meeting.endTime,
              location: meeting.location,
              description: meeting.description || null,
              cancelled: meeting.cancelled || false,
              createdAt: new Date().toISOString(),
            });
          }

          console.log(`✅ Created club: ${mockClub.name}`);
        } else {
          console.log(`⏭️  Club already exists: ${mockClub.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating club ${mockClub.name}:`, error);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}