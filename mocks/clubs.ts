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
        description: i === 0 ? "Regular club meeting" : undefined
      });
    }
  }
  
  return meetings;
};

// Real club data from the provided information
const realClubData = [
  {
    name: "3D Printing and Animation Club",
    presidentName: "Pranav Vinod",
    presidentEmail: "vinod2553@mydusd.org",
    advisorName: "Chris Meyer",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "N-108",
    category: "STEM" as ClubCategory,
    description: "Learn 3D printing and animation techniques through hands-on projects and workshops."
  },
  {
    name: "Acts of Random Kindness Club",
    presidentName: "Khang Fung",
    presidentEmail: "fung9424@mydusd.org",
    advisorName: "Jason Morganstein",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "F-201",
    category: "Community Service" as ClubCategory,
    description: "Spread kindness and positivity through random acts of service in our community."
  },
  {
    name: "Aerospace Club",
    presidentName: "Sohail Kazi",
    presidentEmail: "kazi1290@mydusd.org",
    advisorName: "Jeanne Morgan",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "F-305",
    category: "STEM" as ClubCategory,
    description: "Explore aerospace engineering, rocketry, and space exploration through projects and competitions."
  },
  {
    name: "Afghan Student Association",
    presidentName: "Sahara Salemi",
    presidentEmail: "salemi3165@mydusd.org",
    advisorName: "Mike Ruegg",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-211",
    category: "Cultural" as ClubCategory,
    description: "Celebrate Afghan culture, heritage, and promote cultural understanding among students."
  },
  {
    name: "Animation Club",
    presidentName: "Tina Lin",
    presidentEmail: "lin3225@mydusd.org",
    advisorName: "Chris Meyer",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "N-108",
    category: "Arts" as ClubCategory,
    description: "Create animated content using various digital tools and techniques."
  },
  {
    name: "Archery Club",
    presidentName: "Eujin Michelle Low",
    presidentEmail: "low5021@mydusd.org",
    advisorName: "Neilson Vuong",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-204",
    category: "Sports" as ClubCategory,
    description: "Learn archery skills, safety, and participate in competitions."
  },
  {
    name: "Art Club",
    presidentName: "Emaan Qayyum and Ryan Cho",
    presidentEmail: "qayyum1361@mydusd.org",
    advisorName: "Noel Sollom",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "N-101",
    category: "Arts" as ClubCategory,
    description: "Express creativity through various art forms including painting, drawing, and sculpture."
  },
  {
    name: "Asian Student Association",
    presidentName: "Phoebe Yee & Yena Lee",
    presidentEmail: "yee2852@mydusd.org",
    advisorName: "Celine Shi",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "M-204",
    category: "Cultural" as ClubCategory,
    description: "Promote Asian culture, heritage, and foster community among Asian students."
  },
  {
    name: "AstroGaels",
    presidentName: "Suraj R Kudrikar",
    presidentEmail: "kudrikar1327@mydusd.org",
    advisorName: "Jon White",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "F-304",
    category: "STEM" as ClubCategory,
    description: "Study astronomy, stargazing, and space science through observation and education."
  },
  {
    name: "BC2M",
    presidentName: "Yashita Vijay",
    presidentEmail: "vijay3568@mydusd.org",
    advisorName: "Kelly Gambs",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "J-103",
    category: "Academic" as ClubCategory,
    description: "Support and mentorship program for underrepresented students in STEM fields."
  },
  {
    name: "Best Buddies",
    presidentName: "Lexi Esquivel",
    presidentEmail: "esquivel9503@mydusd.org",
    advisorName: "Lu Middleton",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-105",
    category: "Community Service" as ClubCategory,
    description: "Create friendships and inclusion opportunities for students with intellectual disabilities."
  },
  {
    name: "California Scholarship Federation (CSF)",
    presidentName: "CJ Galang",
    presidentEmail: "galang2959@mydusd.org",
    advisorName: "Kim Halket",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "Sports Complex",
    category: "Academic" as ClubCategory,
    description: "Honor society recognizing academic excellence and community service."
  },
  {
    name: "Cantonese Student Association",
    presidentName: "Audrey Tang",
    presidentEmail: "tang2416@mydusd.org",
    advisorName: "Jaclyn Capie",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-102",
    category: "Cultural" as ClubCategory,
    description: "Promote Cantonese language, culture, and heritage among students."
  },
  {
    name: "Chemistry Club",
    presidentName: "Jonathan Song",
    presidentEmail: "song5227@mydusd.org",
    advisorName: "Michael Correia",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "K-203",
    category: "STEM" as ClubCategory,
    description: "Explore chemistry through experiments, demonstrations, and competitions."
  },
  {
    name: "CodeHers",
    presidentName: "Alicia Wang and Danica Truong",
    presidentEmail: "wang0838@mydusd.org",
    advisorName: "Mitsuka Bude",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "F-307",
    category: "STEM" as ClubCategory,
    description: "Empower girls and non-binary students in coding and technology."
  },
  {
    name: "Data Science Club",
    presidentName: "Ryan Lee",
    presidentEmail: "lee2830@mydusd.org",
    advisorName: "Matthew Janisch",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "L-112",
    category: "STEM" as ClubCategory,
    description: "Learn data analysis, machine learning, and statistical methods."
  },
  {
    name: "DHS 4 The Athletes",
    presidentName: "Tarun Tiwari",
    presidentEmail: "tiwari5235@mydusd.org",
    advisorName: "Tom Costello",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "Weight Room",
    category: "Sports" as ClubCategory,
    description: "Support and celebrate student athletes and sports achievements."
  },
  {
    name: "DHS Adopt a Family",
    presidentName: "Aanya Srivastava",
    presidentEmail: "srivastava2784@mydusd.org",
    advisorName: "Brian Do",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-210",
    category: "Community Service" as ClubCategory,
    description: "Support local families in need through donations and volunteer work."
  },
  {
    name: "DHS Avani",
    presidentName: "Rithika Lakshmi",
    presidentEmail: "lakshmi6820@mydusd.org",
    advisorName: "Brittany Neideffer",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-210",
    category: "Cultural" as ClubCategory,
    description: "Celebrate Indian culture through dance, music, and cultural events."
  },
  {
    name: "DHS Biology Club",
    presidentName: "Brianna Huang",
    presidentEmail: "huang3012@mydusd.org",
    advisorName: "Erica Lee",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-105",
    category: "STEM" as ClubCategory,
    description: "Explore biology through experiments, field trips, and research projects."
  },
  {
    name: "DHS ChangeMakers",
    presidentName: "Hasini Shivakumar",
    presidentEmail: "Shivakumar3443@mydusd.org",
    advisorName: "Silvia Sosa",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-108",
    category: "Community Service" as ClubCategory,
    description: "Create positive change in our community through advocacy and service projects."
  },
  {
    name: "DHS FCSN",
    presidentName: "Joshua Wu",
    presidentEmail: "wu2886@mydusd.org",
    advisorName: "Dan Poulos",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-102",
    category: "Community Service" as ClubCategory,
    description: "Food, Clothing, and Shelter Network - support local community needs."
  },
  {
    name: "DHS Game Development Club",
    presidentName: "Pranav Peethani",
    presidentEmail: "peethani2813@mydusd.org",
    advisorName: "Chris Meyer",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "N-108",
    category: "STEM" as ClubCategory,
    description: "Design and develop video games using various programming tools and engines."
  },
  {
    name: "DHS Lego Club",
    presidentName: "Jack Zhou",
    presidentEmail: "zhou7162@mydusd.org",
    advisorName: "Brian Do",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "J-210",
    category: "Hobbies" as ClubCategory,
    description: "Build creative structures and compete in LEGO robotics challenges."
  },
  {
    name: "DHS Math Club",
    presidentName: "Sophia Henningsen",
    presidentEmail: "henningsen3629@mydusd.org",
    advisorName: "Elena Tigner",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-208",
    category: "Academic" as ClubCategory,
    description: "Solve challenging math problems and prepare for math competitions."
  },
  {
    name: "DHS Photography Club",
    presidentName: "Lucas Farmer",
    presidentEmail: "farmer4501@mydusd.org",
    advisorName: "Arzoo Nasarabadi",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "K-204",
    category: "Arts" as ClubCategory,
    description: "Learn photography techniques and create visual stories through images."
  },
  {
    name: "DHS Poetry",
    presidentName: "Prisha Viswanadha",
    presidentEmail: "viswanadha4696@mydusd.org",
    advisorName: "Brandon Youngsma",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "M-203",
    category: "Arts" as ClubCategory,
    description: "Express thoughts and emotions through poetry writing and performance."
  }
];

export const clubs: Club[] = realClubData.map((data, index) => {
  // Determine meeting frequency based on meeting days
  let meetingFrequency: MeetingFrequency = "Weekly";
  let meetingCount = 3;
  
  if (data.meetingDays.includes("1st and 3rd") || data.meetingDays.includes("2nd and 4th")) {
    meetingFrequency = "Bi-weekly";
    meetingCount = 2;
  } else if (data.meetingDays.includes("Every")) {
    meetingFrequency = "Weekly";
    meetingCount = 3;
  }
  
  // Extract day from meeting days
  const dayMap: { [key: string]: string } = {
    "Monday": "Monday",
    "Tuesday": "Tuesday", 
    "Wednesday": "Wednesday",
    "Thursday": "Thursday",
    "Friday": "Friday"
  };
  
  let meetingDay = "";
  for (const [key, value] of Object.entries(dayMap)) {
    if (data.meetingDays.includes(key)) {
      meetingDay = value;
      break;
    }
  }
  
  // Generate meeting times (assuming lunch is 12:00-13:00)
  const startTime = "12:00";
  const endTime = "13:00";
  
  return {
    id: (index + 1).toString(),
    name: data.name,
    description: data.description,
    category: data.category,
    tags: [data.name.replace(/DHS\s+/g, "").split(" ")[0], data.category],
    advisorName: data.advisorName,
    presidentName: data.presidentName,
    presidentEmail: data.presidentEmail,
    email: `${data.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")}@school.edu`,
    meetingFrequency,
    meetingDay,
    meetingLocation: data.meetingRoom,
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`,
    memberCount: Math.floor(Math.random() * 30) + 10,
    yearFounded: 2015 + (index % 9),
    upcomingMeetings: generateMeetings(meetingCount, meetingDay, startTime, endTime, data.meetingRoom),
    requirements: "Open to all interested students",
    socialMedia: {
      instagram: `@${data.name.toLowerCase().replace(/\s+/g, "").replace(/dhs/g, "").replace(/[^a-z0-9]/g, "")}`
    }
  };
});

export const categories: ClubCategory[] = [
  "Academic",
  "Arts",
  "Business",
  "Community Service",
  "Cultural",
  "Hobbies",
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