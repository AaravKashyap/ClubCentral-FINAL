export type ClubCategory = 
  | "Academic" 
  | "Arts" 
  | "Business"
  | "Community Service" 
  | "Cultural" 
  | "Hobbies"
  | "STEM" 
  | "Sports" 
  | "Leadership" 
  | "Other";

export type MeetingFrequency = 
  | "Weekly" 
  | "Bi-weekly" 
  | "Monthly" 
  | "Varies";

export type ClubMeeting = {
  date: string; // ISO date string
  startTime: string; // Format: "14:30"
  endTime: string; // Format: "16:00"
  location: string;
  description?: string;
};

export type Club = {
  id: string;
  name: string;
  description: string;
  category: ClubCategory;
  tags: string[];
  advisorName: string;
  presidentName: string;
  presidentEmail: string;
  email: string;
  meetingFrequency: MeetingFrequency;
  meetingDay?: string; // e.g., "Monday", "Tuesday"
  meetingTime?: string; // e.g., "Lunch", "3:00 PM"
  meetingLocation?: string;
  imageUrl?: string | null;
  memberCount: number;
  yearFounded: number;
  upcomingMeetings: ClubMeeting[];
  requirements?: string;
  socialMedia?: {
    instagram?: string;
    discord?: string;
    website?: string;
  };
  events?: ClubEvent[];
  portfolios?: string[];
};

export type ClubEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  createdAt: string;
};

export type ClubUpdate = {
  socialMedia?: {
    instagram?: string;
    discord?: string;
    website?: string;
  };
  events?: ClubEvent[];
  portfolios?: string[];
  description?: string;
  imageUrl?: string | null;
};

export type AdminNotification = {
  id: string;
  type: 'admin_approval';
  userId: string;
  userName: string;
  userEmail: string;
  clubId?: string;
  clubName?: string;
  createdAt: string;
  read: boolean;
};