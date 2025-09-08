import { Club, ClubCategory, MeetingFrequency } from "@/types/club";

const generateMeetings = (
  count: number, 
  day: string, 
  startTime: string, 
  endTime: string, 
  location: string
): any[] => {
  const meetings = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    // Find the next occurrence of the specified day
    let meetingDate = new Date(today);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = daysOfWeek.indexOf(day);
    
    if (targetDayIndex !== -1) {
      const currentDayIndex = today.getDay();
      let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;
      
      // If today is the target day but it's past the meeting time, move to next week
      if (daysToAdd === 0) {
        const currentHour = today.getHours();
        const meetingHour = parseInt(startTime.split(":")[0]);
        
        if (currentHour >= meetingHour) {
          daysToAdd = 7;
        }
      }
      
      // Add days to current date
      meetingDate.setDate(today.getDate() + daysToAdd + (i * 7));
      
      meetings.push({
        date: meetingDate.toISOString().split("T")[0],
        startTime,
        endTime,
        location,
        description: i === 0 ? "Important meeting! New member welcome." : undefined
      });
    }
  }
  
  return meetings;
};

export const clubs: Club[] = [
  {
    id: "1",
    name: "Robotics Club",
    description: "We design, build, and program robots for competitions and exhibitions. Join us to learn engineering, programming, and teamwork skills!",
    category: "STEM" as ClubCategory,
    tags: ["Engineering", "Programming", "Competitions"],
    advisorName: "Dr. Sarah Chen",
    presidentName: "Alex Johnson",
    email: "robotics@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Tuesday",
    meetingLocation: "Room 203 (Engineering Lab)",
    imageUrl: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f",
    memberCount: 28,
    yearFounded: 2015,
    upcomingMeetings: generateMeetings(3, "Tuesday", "15:30", "17:00", "Room 203 (Engineering Lab)"),
    requirements: "No prior experience needed, just enthusiasm for robotics!",
    socialMedia: {
      instagram: "@schoolrobotics",
      website: "schoolrobotics.org"
    }
  },
  {
    id: "2",
    name: "Debate Team",
    description: "Sharpen your critical thinking and public speaking skills through competitive debate. We participate in regional and state tournaments.",
    category: "Academic" as ClubCategory,
    tags: ["Public Speaking", "Critical Thinking", "Competitions"],
    advisorName: "Mr. James Wilson",
    presidentName: "Sophia Garcia",
    email: "debate@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 105",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
    memberCount: 15,
    yearFounded: 2010,
    upcomingMeetings: generateMeetings(2, "Wednesday", "16:00", "17:30", "Room 105"),
    requirements: "Commitment to attend competitions and practice sessions",
    socialMedia: {
      instagram: "@schooldebate"
    }
  },
  {
    id: "3",
    name: "Art Club",
    description: "Express yourself through various art forms including painting, drawing, and sculpture. We host exhibitions and collaborate on school murals.",
    category: "Arts" as ClubCategory,
    tags: ["Painting", "Drawing", "Creativity"],
    advisorName: "Ms. Emily Rodriguez",
    presidentName: "Noah Kim",
    email: "artclub@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Art Room 101",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
    memberCount: 22,
    yearFounded: 2008,
    upcomingMeetings: generateMeetings(3, "Thursday", "15:00", "16:30", "Art Room 101"),
    requirements: "Bring your own supplies (basic materials provided)",
    socialMedia: {
      instagram: "@schoolartclub"
    }
  },
  {
    id: "4",
    name: "Environmental Club",
    description: "Dedicated to promoting sustainability and environmental awareness on campus and in our community through projects and education.",
    category: "Community Service" as ClubCategory,
    tags: ["Environment", "Sustainability", "Community"],
    advisorName: "Ms. Lisa Park",
    presidentName: "Ethan Brown",
    email: "eco@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Monday",
    meetingLocation: "Room 156",
    imageUrl: "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36",
    memberCount: 18,
    yearFounded: 2017,
    upcomingMeetings: generateMeetings(2, "Monday", "15:30", "16:30", "Room 156"),
    socialMedia: {
      instagram: "@schooleco",
      website: "schooleco.org"
    }
  },
  {
    id: "5",
    name: "Chess Club",
    description: "Learn and play chess with peers of all skill levels. We host tournaments and provide coaching for beginners to advanced players.",
    category: "Academic" as ClubCategory,
    tags: ["Strategy", "Competitions", "Logic"],
    advisorName: "Mr. Robert Lee",
    presidentName: "Emma Davis",
    email: "chess@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Friday",
    meetingLocation: "Library",
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b",
    memberCount: 12,
    yearFounded: 2011,
    upcomingMeetings: generateMeetings(3, "Friday", "15:00", "16:30", "Library"),
    requirements: "All skill levels welcome"
  },
  {
    id: "6",
    name: "Cultural Awareness Society",
    description: "Celebrating diversity and promoting cultural understanding through events, discussions, and community outreach.",
    category: "Cultural" as ClubCategory,
    tags: ["Diversity", "Culture", "Events"],
    advisorName: "Dr. Maria Gonzalez",
    presidentName: "Aiden Patel",
    email: "cultural@school.edu",
    meetingFrequency: "Monthly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 210",
    imageUrl: "https://images.unsplash.com/photo-1526976668912-1a811878dd37",
    memberCount: 25,
    yearFounded: 2016,
    upcomingMeetings: generateMeetings(1, "Wednesday", "16:00", "17:00", "Room 210"),
    socialMedia: {
      instagram: "@schoolculturalsociety"
    }
  },
  {
    id: "7",
    name: "Coding Club",
    description: "Learn programming languages, work on coding projects, and participate in hackathons. All experience levels welcome!",
    category: "STEM" as ClubCategory,
    tags: ["Programming", "Web Development", "App Development"],
    advisorName: "Mr. David Chang",
    presidentName: "Olivia Martinez",
    email: "coding@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Monday",
    meetingLocation: "Computer Lab 2",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    memberCount: 20,
    yearFounded: 2018,
    upcomingMeetings: generateMeetings(3, "Monday", "16:00", "17:30", "Computer Lab 2"),
    requirements: "Bring your laptop if possible",
    socialMedia: {
      website: "schoolcoding.github.io"
    }
  },
  {
    id: "8",
    name: "Student Government",
    description: "Represent student interests, organize school events, and develop leadership skills through service to our school community.",
    category: "Leadership" as ClubCategory,
    tags: ["Leadership", "Events", "Community"],
    advisorName: "Ms. Jennifer Taylor",
    presidentName: "William Jackson",
    email: "studentgov@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Tuesday",
    meetingLocation: "Room 120",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624",
    memberCount: 15,
    yearFounded: 2005,
    upcomingMeetings: generateMeetings(3, "Tuesday", "15:30", "17:00", "Room 120"),
    requirements: "Elected positions require student body vote",
    socialMedia: {
      instagram: "@schoolstudentgov",
      website: "schoolstudentgov.org"
    }
  },
  {
    id: "9",
    name: "Photography Club",
    description: "Explore the art of photography through workshops, photo walks, and exhibitions. Learn techniques and develop your unique style.",
    category: "Arts" as ClubCategory,
    tags: ["Photography", "Visual Arts", "Creativity"],
    advisorName: "Mr. Thomas Wright",
    presidentName: "Isabella Lopez",
    email: "photo@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Room 108",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    memberCount: 16,
    yearFounded: 2014,
    upcomingMeetings: generateMeetings(2, "Thursday", "15:30", "17:00", "Room 108"),
    requirements: "Access to a camera (phone cameras are fine)",
    socialMedia: {
      instagram: "@schoolphotography"
    }
  },
  {
    id: "10",
    name: "Math Team",
    description: "Tackle challenging math problems and compete in regional and national mathematics competitions.",
    category: "Academic" as ClubCategory,
    tags: ["Mathematics", "Problem Solving", "Competitions"],
    advisorName: "Dr. Michael Chen",
    presidentName: "Sophia Williams",
    email: "mathteam@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 205",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    memberCount: 14,
    yearFounded: 2009,
    upcomingMeetings: generateMeetings(3, "Wednesday", "15:30", "16:30", "Room 205"),
    requirements: "Completion of Algebra I or equivalent",
    socialMedia: {
      website: "schoolmathteam.org"
    }
  },
  {
    id: "11",
    name: "Drama Club",
    description: "Perform in school plays and musicals while developing acting, directing, and stagecraft skills.",
    category: "Arts" as ClubCategory,
    tags: ["Theater", "Acting", "Performance"],
    advisorName: "Ms. Rebecca Johnson",
    presidentName: "Lucas Thompson",
    email: "drama@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Friday",
    meetingLocation: "Auditorium",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35",
    memberCount: 30,
    yearFounded: 2007,
    upcomingMeetings: generateMeetings(3, "Friday", "16:00", "18:00", "Auditorium"),
    socialMedia: {
      instagram: "@schooldrama"
    }
  },
  {
    id: "12",
    name: "Science Olympiad",
    description: "Prepare for and compete in Science Olympiad tournaments covering various scientific disciplines.",
    category: "STEM" as ClubCategory,
    tags: ["Science", "Competitions", "Research"],
    advisorName: "Dr. Elizabeth Foster",
    presidentName: "Daniel Kim",
    email: "scioly@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Science Lab 3",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    memberCount: 22,
    yearFounded: 2012,
    upcomingMeetings: generateMeetings(3, "Thursday", "15:30", "17:00", "Science Lab 3"),
    requirements: "Commitment to competition preparation",
    socialMedia: {
      website: "schoolscioly.org"
    }
  }
];

export const categories: ClubCategory[] = [
  "Academic",
  "Arts",
  "Community Service",
  "Cultural",
  "STEM",
  "Sports",
  "Leadership",
  "Other"
];

export const getClubsByCategory = (category: ClubCategory): Club[] => {
  return clubs.filter(club => club.category === category);
};

export const getUpcomingMeetings = (limit: number = 5): { club: Club, meeting: any }[] => {
  const allMeetings: { club: Club, meeting: any }[] = [];
  
  clubs.forEach(club => {
    club.upcomingMeetings.forEach(meeting => {
      allMeetings.push({ club, meeting });
    });
  });
  
  // Sort by date and time
  allMeetings.sort((a, b) => {
    const dateA = new Date(`${a.meeting.date}T${a.meeting.startTime}`);
    const dateB = new Date(`${b.meeting.date}T${b.meeting.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  return allMeetings.slice(0, limit);
};