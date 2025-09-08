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
    presidentEmail: "alex.johnson@school.edu",
    email: "robotics@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Tuesday",
    meetingLocation: "Room 203 (Engineering Lab)",
    imageUrl: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=400&h=300&fit=crop",
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
    presidentEmail: "sophia.garcia@school.edu",
    email: "debate@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 105",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
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
    presidentEmail: "noah.kim@school.edu",
    email: "artclub@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Art Room 101",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop",
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
    presidentEmail: "ethan.brown@school.edu",
    email: "eco@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Monday",
    meetingLocation: "Room 156",
    imageUrl: "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?w=400&h=300&fit=crop",
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
    presidentEmail: "emma.davis@school.edu",
    email: "chess@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Friday",
    meetingLocation: "Library",
    imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=300&fit=crop",
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
    presidentEmail: "aiden.patel@school.edu",
    email: "cultural@school.edu",
    meetingFrequency: "Monthly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 210",
    imageUrl: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=400&h=300&fit=crop",
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
    presidentEmail: "olivia.martinez@school.edu",
    email: "coding@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Monday",
    meetingLocation: "Computer Lab 2",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
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
    presidentEmail: "william.jackson@school.edu",
    email: "studentgov@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Tuesday",
    meetingLocation: "Room 120",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop",
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
    presidentEmail: "isabella.lopez@school.edu",
    email: "photo@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Room 108",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
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
    presidentEmail: "sophia.williams@school.edu",
    email: "mathteam@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 205",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
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
    presidentEmail: "lucas.thompson@school.edu",
    email: "drama@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Friday",
    meetingLocation: "Auditorium",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop",
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
    presidentEmail: "daniel.kim@school.edu",
    email: "scioly@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Science Lab 3",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop",
    memberCount: 22,
    yearFounded: 2012,
    upcomingMeetings: generateMeetings(3, "Thursday", "15:30", "17:00", "Science Lab 3"),
    requirements: "Commitment to competition preparation",
    socialMedia: {
      website: "schoolscioly.org"
    }
  },
  {
    id: "13",
    name: "Model UN",
    description: "Simulate United Nations conferences and develop diplomatic skills while discussing global issues and international relations.",
    category: "Academic" as ClubCategory,
    tags: ["Diplomacy", "International Relations", "Public Speaking"],
    advisorName: "Ms. Patricia Adams",
    presidentName: "Maya Singh",
    presidentEmail: "maya.singh@school.edu",
    email: "modelun@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Wednesday",
    meetingLocation: "Room 301",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop",
    memberCount: 24,
    yearFounded: 2013,
    upcomingMeetings: generateMeetings(3, "Wednesday", "15:30", "17:00", "Room 301"),
    requirements: "Interest in global affairs and public speaking",
    socialMedia: {
      instagram: "@schoolmodelun"
    }
  },
  {
    id: "14",
    name: "Yearbook Committee",
    description: "Capture memories and create the school yearbook through photography, writing, and design.",
    category: "Arts" as ClubCategory,
    tags: ["Photography", "Writing", "Design"],
    advisorName: "Mr. Kevin Martinez",
    presidentName: "Rachel Green",
    presidentEmail: "rachel.green@school.edu",
    email: "yearbook@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Thursday",
    meetingLocation: "Room 115",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    memberCount: 18,
    yearFounded: 2006,
    upcomingMeetings: generateMeetings(3, "Thursday", "15:00", "16:30", "Room 115"),
    requirements: "Basic photography or writing skills preferred",
    socialMedia: {
      instagram: "@schoolyearbook"
    }
  },
  {
    id: "15",
    name: "Volunteer Club",
    description: "Organize community service projects and volunteer opportunities to make a positive impact in our local community.",
    category: "Community Service" as ClubCategory,
    tags: ["Volunteering", "Community Service", "Social Impact"],
    advisorName: "Ms. Angela White",
    presidentName: "David Chen",
    presidentEmail: "david.chen@school.edu",
    email: "volunteer@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Friday",
    meetingLocation: "Room 220",
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    memberCount: 32,
    yearFounded: 2011,
    upcomingMeetings: generateMeetings(2, "Friday", "15:30", "16:30", "Room 220"),
    requirements: "Commitment to community service",
    socialMedia: {
      instagram: "@schoolvolunteers",
      website: "schoolvolunteers.org"
    }
  },
  {
    id: "16",
    name: "Gaming Club",
    description: "Play board games, video games, and organize tournaments. A place for gamers to connect and compete.",
    category: "Hobbies" as ClubCategory,
    tags: ["Gaming", "Tournaments", "Strategy"],
    advisorName: "Mr. Jason Liu",
    presidentName: "Tyler Brooks",
    presidentEmail: "tyler.brooks@school.edu",
    email: "gaming@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Friday",
    meetingLocation: "Room 112",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    memberCount: 26,
    yearFounded: 2019,
    upcomingMeetings: generateMeetings(3, "Friday", "15:00", "17:00", "Room 112"),
    requirements: "Love for games and good sportsmanship",
    socialMedia: {
      discord: "SchoolGaming#1234"
    }
  },
  {
    id: "17",
    name: "Book Club",
    description: "Read and discuss literature, share book recommendations, and explore different genres together.",
    category: "Academic" as ClubCategory,
    tags: ["Reading", "Literature", "Discussion"],
    advisorName: "Ms. Sarah Thompson",
    presidentName: "Emily Watson",
    presidentEmail: "emily.watson@school.edu",
    email: "bookclub@school.edu",
    meetingFrequency: "Bi-weekly" as MeetingFrequency,
    meetingDay: "Tuesday",
    meetingLocation: "Library",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    memberCount: 19,
    yearFounded: 2014,
    upcomingMeetings: generateMeetings(2, "Tuesday", "15:30", "16:30", "Library"),
    requirements: "Love for reading and open discussion",
    socialMedia: {
      instagram: "@schoolbookclub"
    }
  },
  {
    id: "18",
    name: "Music Production Club",
    description: "Learn music production, create beats, and collaborate on original compositions using digital audio workstations.",
    category: "Arts" as ClubCategory,
    tags: ["Music Production", "Audio Engineering", "Creativity"],
    advisorName: "Mr. Marcus Johnson",
    presidentName: "Jordan Lee",
    presidentEmail: "jordan.lee@school.edu",
    email: "musicprod@school.edu",
    meetingFrequency: "Weekly" as MeetingFrequency,
    meetingDay: "Monday",
    meetingLocation: "Music Room 2",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    memberCount: 15,
    yearFounded: 2020,
    upcomingMeetings: generateMeetings(3, "Monday", "16:00", "17:30", "Music Room 2"),
    requirements: "Interest in music and technology",
    socialMedia: {
      instagram: "@schoolmusicprod",
      website: "schoolmusicprod.com"
    }
  }
];

// Add more clubs to reach closer to 100
for (let i = 19; i <= 100; i++) {
  const categories: ClubCategory[] = ["Academic", "Arts", "Community Service", "Cultural", "STEM", "Sports", "Leadership", "Hobbies"];
  const category = categories[i % categories.length];
  const names = [
    "Film Club", "Anime Club", "Cooking Club", "Gardening Club", "Hiking Club", "Language Exchange",
    "Meditation Club", "Fitness Club", "Dance Club", "Choir", "Band", "Orchestra", "Jazz Ensemble",
    "Creative Writing", "Poetry Club", "History Club", "Geography Club", "Psychology Club",
    "Philosophy Club", "Economics Club", "Business Club", "Entrepreneurship Club", "Investment Club",
    "Astronomy Club", "Biology Club", "Chemistry Club", "Physics Club", "Computer Science Club",
    "Web Development Club", "AI/ML Club", "Cybersecurity Club", "3D Printing Club", "Maker Club",
    "Soccer Club", "Basketball Club", "Tennis Club", "Volleyball Club", "Track & Field",
    "Swimming Club", "Martial Arts Club", "Yoga Club", "Rock Climbing Club", "Cycling Club",
    "Cultural Dance", "International Club", "Spanish Club", "French Club", "German Club",
    "Japanese Club", "Chinese Club", "Korean Club", "Italian Club", "Russian Club",
    "Peer Tutoring", "Mentorship Club", "Leadership Academy", "Student Council", "Honor Society",
    "Key Club", "Interact Club", "Leo Club", "Red Cross Club", "Habitat for Humanity",
    "Environmental Action", "Recycling Club", "Green Team", "Sustainability Club", "Climate Action",
    "Animal Welfare", "Pet Care Club", "Wildlife Conservation", "Nature Club", "Outdoor Adventure",
    "Photography Workshop", "Digital Art", "Graphic Design", "Fashion Design", "Interior Design",
    "Architecture Club", "Urban Planning", "Engineering Design", "Invention Club", "Patent Club",
    "Debate Society", "Speech Club", "Toastmasters", "Communication Club", "Media Club"
  ];
  
  const name = names[(i - 19) % names.length] || `Club ${i}`;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const day = days[i % days.length];
  const times = ["15:00", "15:30", "16:00", "16:30"];
  const startTime = times[i % times.length];
  const endTime = startTime === "15:00" ? "16:30" : startTime === "15:30" ? "17:00" : startTime === "16:00" ? "17:30" : "18:00";
  const locations = ["Room 101", "Room 102", "Room 103", "Library", "Gym", "Auditorium", "Cafeteria", "Computer Lab"];
  const location = locations[i % locations.length];
  const frequencies: MeetingFrequency[] = ["Weekly", "Bi-weekly", "Monthly"];
  const frequency = frequencies[i % frequencies.length];
  
  clubs.push({
    id: i.toString(),
    name,
    description: `Join our ${name} to explore your interests and connect with like-minded students. We welcome all skill levels!`,
    category,
    tags: [name.replace(" Club", ""), "Community", "Learning"],
    advisorName: `Teacher ${i}`,
    presidentName: `Student ${i}`,
    presidentEmail: `student${i}@school.edu`,
    email: `${name.toLowerCase().replace(/\s+/g, "")}@school.edu`,
    meetingFrequency: frequency,
    meetingDay: day,
    meetingLocation: location,
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=300&fit=crop`,
    memberCount: Math.floor(Math.random() * 30) + 10,
    yearFounded: 2010 + (i % 14),
    upcomingMeetings: generateMeetings(frequency === "Weekly" ? 3 : frequency === "Bi-weekly" ? 2 : 1, day, startTime, endTime, location),
    requirements: "Open to all students",
    socialMedia: {
      instagram: `@school${name.toLowerCase().replace(/\s+/g, "")}`
    }
  });
}

export const categories: ClubCategory[] = [
  "Academic",
  "Arts",
  "Community Service",
  "Cultural",
  "STEM",
  "Sports",
  "Leadership",
  "Hobbies",
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