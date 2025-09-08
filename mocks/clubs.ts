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
  },
  {
    name: "DHS Robotics Club",
    presidentName: "Ethan Chen",
    presidentEmail: "chen5432@mydusd.org",
    advisorName: "Sarah Johnson",
    meetingDays: "Every Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "N-110",
    category: "STEM" as ClubCategory,
    description: "Build and program robots for competitions and learning."
  },
  {
    name: "Debate Club",
    presidentName: "Maya Patel",
    presidentEmail: "patel3456@mydusd.org",
    advisorName: "Robert Williams",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-205",
    category: "Academic" as ClubCategory,
    description: "Develop public speaking and argumentation skills through competitive debate."
  },
  {
    name: "Environmental Club",
    presidentName: "Alex Rodriguez",
    presidentEmail: "rodriguez2345@mydusd.org",
    advisorName: "Jennifer Green",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-107",
    category: "Community Service" as ClubCategory,
    description: "Promote environmental awareness and sustainability initiatives on campus."
  },
  {
    name: "Film Club",
    presidentName: "Jordan Lee",
    presidentEmail: "lee4567@mydusd.org",
    advisorName: "Michael Brown",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-105",
    category: "Arts" as ClubCategory,
    description: "Watch, analyze, and create films while learning about cinematography."
  },
  {
    name: "French Club",
    presidentName: "Sophie Martin",
    presidentEmail: "martin3456@mydusd.org",
    advisorName: "Marie Dubois",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-301",
    category: "Cultural" as ClubCategory,
    description: "Explore French language, culture, and cuisine through interactive activities."
  },
  {
    name: "Guitar Club",
    presidentName: "Ryan Thompson",
    presidentEmail: "thompson5678@mydusd.org",
    advisorName: "David Miller",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "N-205",
    category: "Arts" as ClubCategory,
    description: "Learn guitar techniques and perform music together."
  },
  {
    name: "Hiking Club",
    presidentName: "Emma Wilson",
    presidentEmail: "wilson3456@mydusd.org",
    advisorName: "Tom Anderson",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "Gym",
    category: "Sports" as ClubCategory,
    description: "Organize hiking trips and outdoor adventures for students."
  },
  {
    name: "History Club",
    presidentName: "Daniel Kim",
    presidentEmail: "kim4567@mydusd.org",
    advisorName: "Patricia Davis",
    meetingDays: "Every Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-110",
    category: "Academic" as ClubCategory,
    description: "Explore historical events and participate in history competitions."
  },
  {
    name: "International Relations Club",
    presidentName: "Isabella Garcia",
    presidentEmail: "garcia5678@mydusd.org",
    advisorName: "James Taylor",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-301",
    category: "Academic" as ClubCategory,
    description: "Discuss global affairs and participate in Model UN conferences."
  },
  {
    name: "Japanese Culture Club",
    presidentName: "Yuki Tanaka",
    presidentEmail: "tanaka3456@mydusd.org",
    advisorName: "Lisa Chen",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-205",
    category: "Cultural" as ClubCategory,
    description: "Experience Japanese culture through language, food, and traditions."
  },
  {
    name: "Jazz Band Club",
    presidentName: "Marcus Johnson",
    presidentEmail: "johnson4567@mydusd.org",
    advisorName: "William Scott",
    meetingDays: "Every Monday",
    meetingTime: "Lunch",
    meetingRoom: "Music Room",
    category: "Arts" as ClubCategory,
    description: "Perform jazz music and learn improvisation techniques."
  },
  {
    name: "Journalism Club",
    presidentName: "Olivia Brown",
    presidentEmail: "brown5678@mydusd.org",
    advisorName: "Nancy White",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "J-201",
    category: "Academic" as ClubCategory,
    description: "Write articles and produce the school newspaper."
  },
  {
    name: "Key Club",
    presidentName: "Nathan Park",
    presidentEmail: "park3456@mydusd.org",
    advisorName: "Susan Martinez",
    meetingDays: "Every Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-203",
    category: "Community Service" as ClubCategory,
    description: "International service organization for high school students."
  },
  {
    name: "Korean Club",
    presidentName: "Jin Woo Kim",
    presidentEmail: "kimjw4567@mydusd.org",
    advisorName: "Helen Park",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "M-108",
    category: "Cultural" as ClubCategory,
    description: "Share Korean culture, K-pop, and traditional activities."
  },
  {
    name: "Latin Club",
    presidentName: "Victoria Adams",
    presidentEmail: "adams5678@mydusd.org",
    advisorName: "Richard Jones",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-305",
    category: "Academic" as ClubCategory,
    description: "Study Latin language and ancient Roman culture."
  },
  {
    name: "LGBTQ+ Alliance",
    presidentName: "Sam Taylor",
    presidentEmail: "taylor3456@mydusd.org",
    advisorName: "Chris Morgan",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-301",
    category: "Cultural" as ClubCategory,
    description: "Create a safe and inclusive space for LGBTQ+ students and allies."
  },
  {
    name: "Medical Club",
    presidentName: "Priya Sharma",
    presidentEmail: "sharma4567@mydusd.org",
    advisorName: "Dr. Emily Chen",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "J-107",
    category: "STEM" as ClubCategory,
    description: "Explore medical careers and healthcare topics."
  },
  {
    name: "Mock Trial",
    presidentName: "Christopher Lee",
    presidentEmail: "leec5678@mydusd.org",
    advisorName: "Barbara Wilson",
    meetingDays: "Every Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-201",
    category: "Academic" as ClubCategory,
    description: "Simulate court trials and learn about the legal system."
  },
  {
    name: "Model United Nations",
    presidentName: "Amanda Rodriguez",
    presidentEmail: "rodrigueza3456@mydusd.org",
    advisorName: "Mark Thompson",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "M-302",
    category: "Academic" as ClubCategory,
    description: "Simulate UN committees and debate international issues."
  },
  {
    name: "Music Production Club",
    presidentName: "Tyler Davis",
    presidentEmail: "davis4567@mydusd.org",
    advisorName: "Kevin Brown",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "N-203",
    category: "Arts" as ClubCategory,
    description: "Create and produce original music using digital tools."
  },
  {
    name: "National Honor Society",
    presidentName: "Rachel Green",
    presidentEmail: "green5678@mydusd.org",
    advisorName: "Linda Johnson",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "Library",
    category: "Academic" as ClubCategory,
    description: "Honor society recognizing outstanding high school students."
  },
  {
    name: "Origami Club",
    presidentName: "Kenji Yamamoto",
    presidentEmail: "yamamoto3456@mydusd.org",
    advisorName: "Amy Liu",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "K-108",
    category: "Hobbies" as ClubCategory,
    description: "Learn the art of paper folding and create intricate designs."
  },
  {
    name: "Peer Tutoring Club",
    presidentName: "Michael Chang",
    presidentEmail: "changm4567@mydusd.org",
    advisorName: "Jennifer Adams",
    meetingDays: "Every Tuesday and Thursday",
    meetingTime: "Lunch",
    meetingRoom: "Library Study Room",
    category: "Academic" as ClubCategory,
    description: "Provide free tutoring services to fellow students."
  },
  {
    name: "Philosophy Club",
    presidentName: "Alexander Wright",
    presidentEmail: "wright5678@mydusd.org",
    advisorName: "Dr. Thomas Hill",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-307",
    category: "Academic" as ClubCategory,
    description: "Discuss philosophical ideas and ethical dilemmas."
  },
  {
    name: "Physics Club",
    presidentName: "David Liu",
    presidentEmail: "liu3456@mydusd.org",
    advisorName: "Dr. Robert Chen",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "F-201",
    category: "STEM" as ClubCategory,
    description: "Explore physics concepts through experiments and competitions."
  },
  {
    name: "Ping Pong Club",
    presidentName: "Kevin Zhang",
    presidentEmail: "zhang4567@mydusd.org",
    advisorName: "Coach Miller",
    meetingDays: "Every Monday and Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "Gym Annex",
    category: "Sports" as ClubCategory,
    description: "Play table tennis and organize tournaments."
  },
  {
    name: "Psychology Club",
    presidentName: "Sarah Mitchell",
    presidentEmail: "mitchell5678@mydusd.org",
    advisorName: "Dr. Lisa Brown",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "J-203",
    category: "Academic" as ClubCategory,
    description: "Explore human behavior and psychological concepts."
  },
  {
    name: "Quizbowl Team",
    presidentName: "Benjamin Lee",
    presidentEmail: "leeb3456@mydusd.org",
    advisorName: "Paul Anderson",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-109",
    category: "Academic" as ClubCategory,
    description: "Compete in academic trivia competitions."
  },
  {
    name: "Red Cross Club",
    presidentName: "Emily Wang",
    presidentEmail: "wang4567@mydusd.org",
    advisorName: "Maria Garcia",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "K-203",
    category: "Community Service" as ClubCategory,
    description: "Support Red Cross initiatives and blood drives."
  },
  {
    name: "Recycling Club",
    presidentName: "Jason Park",
    presidentEmail: "parkj5678@mydusd.org",
    advisorName: "Steve Johnson",
    meetingDays: "Every Thursday",
    meetingTime: "Lunch",
    meetingRoom: "J-109",
    category: "Community Service" as ClubCategory,
    description: "Promote recycling and waste reduction on campus."
  },
  {
    name: "Science Olympiad",
    presidentName: "Michelle Chen",
    presidentEmail: "chenm3456@mydusd.org",
    advisorName: "Dr. Karen White",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "F-303",
    category: "STEM" as ClubCategory,
    description: "Compete in science competitions across various disciplines."
  },
  {
    name: "Shakespeare Club",
    presidentName: "Elizabeth Turner",
    presidentEmail: "turner4567@mydusd.org",
    advisorName: "Margaret Davis",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "M-201",
    category: "Arts" as ClubCategory,
    description: "Study and perform Shakespeare's plays."
  },
  {
    name: "Sign Language Club",
    presidentName: "Ashley Martinez",
    presidentEmail: "martineza5678@mydusd.org",
    advisorName: "Sandra Lee",
    meetingDays: "Every Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-106",
    category: "Cultural" as ClubCategory,
    description: "Learn American Sign Language and deaf culture."
  },
  {
    name: "Skateboarding Club",
    presidentName: "Jake Wilson",
    presidentEmail: "wilsonj3456@mydusd.org",
    advisorName: "Tony Rodriguez",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "After School",
    meetingRoom: "Parking Lot B",
    category: "Sports" as ClubCategory,
    description: "Practice skateboarding tricks and organize skate sessions."
  },
  {
    name: "Spanish Club",
    presidentName: "Carlos Mendez",
    presidentEmail: "mendez4567@mydusd.org",
    advisorName: "Rosa Martinez",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-302",
    category: "Cultural" as ClubCategory,
    description: "Celebrate Spanish and Latin American cultures."
  },
  {
    name: "Speech and Debate",
    presidentName: "Nicole Adams",
    presidentEmail: "adamsn5678@mydusd.org",
    advisorName: "John Miller",
    meetingDays: "Every Monday and Thursday",
    meetingTime: "Lunch",
    meetingRoom: "M-105",
    category: "Academic" as ClubCategory,
    description: "Compete in speech and debate tournaments."
  },
  {
    name: "Student Government",
    presidentName: "Matthew Johnson",
    presidentEmail: "johnsonm3456@mydusd.org",
    advisorName: "Principal Smith",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "Main Office Conference Room",
    category: "Leadership" as ClubCategory,
    description: "Lead student body and organize school events."
  },
  {
    name: "Surf Club",
    presidentName: "Dylan Beach",
    presidentEmail: "beach4567@mydusd.org",
    advisorName: "Coach Waters",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "After School",
    meetingRoom: "Pool Area",
    category: "Sports" as ClubCategory,
    description: "Learn surfing and ocean safety."
  },
  {
    name: "Table Tennis Club",
    presidentName: "Andy Liu",
    presidentEmail: "liua5678@mydusd.org",
    advisorName: "Coach Chen",
    meetingDays: "Every Tuesday and Thursday",
    meetingTime: "Lunch",
    meetingRoom: "Gym",
    category: "Sports" as ClubCategory,
    description: "Practice table tennis skills and compete in tournaments."
  },
  {
    name: "Technology Student Association",
    presidentName: "Robert Kim",
    presidentEmail: "kimr3456@mydusd.org",
    advisorName: "Mr. Tech",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "Computer Lab 2",
    category: "STEM" as ClubCategory,
    description: "Compete in technology and engineering competitions."
  },
  {
    name: "Tennis Club",
    presidentName: "Jessica Lee",
    presidentEmail: "leej4567@mydusd.org",
    advisorName: "Coach Williams",
    meetingDays: "Every Monday and Wednesday",
    meetingTime: "After School",
    meetingRoom: "Tennis Courts",
    category: "Sports" as ClubCategory,
    description: "Practice tennis and organize friendly matches."
  },
  {
    name: "Theater Club",
    presidentName: "Sophia Anderson",
    presidentEmail: "andersons5678@mydusd.org",
    advisorName: "Drama Teacher Jones",
    meetingDays: "Every Tuesday and Thursday",
    meetingTime: "After School",
    meetingRoom: "Theater",
    category: "Arts" as ClubCategory,
    description: "Produce and perform theatrical productions."
  },
  {
    name: "Ultimate Frisbee Club",
    presidentName: "Connor Smith",
    presidentEmail: "smithc3456@mydusd.org",
    advisorName: "PE Teacher Brown",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "After School",
    meetingRoom: "Field",
    category: "Sports" as ClubCategory,
    description: "Play ultimate frisbee and compete in tournaments."
  },
  {
    name: "Video Game Club",
    presidentName: "Brandon Wu",
    presidentEmail: "wub4567@mydusd.org",
    advisorName: "Mr. Digital",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "Computer Lab 1",
    category: "Hobbies" as ClubCategory,
    description: "Play and discuss video games, organize tournaments."
  },
  {
    name: "Volleyball Club",
    presidentName: "Maria Santos",
    presidentEmail: "santos5678@mydusd.org",
    advisorName: "Coach Taylor",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "After School",
    meetingRoom: "Gym",
    category: "Sports" as ClubCategory,
    description: "Practice volleyball skills and play friendly games."
  },
  {
    name: "Web Design Club",
    presidentName: "Justin Park",
    presidentEmail: "parkjustin3456@mydusd.org",
    advisorName: "Ms. Code",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "Computer Lab 3",
    category: "STEM" as ClubCategory,
    description: "Learn web development and create websites."
  },
  {
    name: "Women in STEM",
    presidentName: "Grace Chen",
    presidentEmail: "cheng4567@mydusd.org",
    advisorName: "Dr. Science",
    meetingDays: "Every Thursday",
    meetingTime: "Lunch",
    meetingRoom: "F-306",
    category: "STEM" as ClubCategory,
    description: "Support and encourage women pursuing STEM careers."
  },
  {
    name: "World Languages Club",
    presidentName: "International Team",
    presidentEmail: "languages5678@mydusd.org",
    advisorName: "Language Department",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-304",
    category: "Cultural" as ClubCategory,
    description: "Explore different languages and cultures around the world."
  },
  {
    name: "Writing Club",
    presidentName: "Emma Thompson",
    presidentEmail: "thompsone3456@mydusd.org",
    advisorName: "English Teacher Smith",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-202",
    category: "Arts" as ClubCategory,
    description: "Improve writing skills and share creative works."
  },
  {
    name: "Yearbook Committee",
    presidentName: "Photography Team",
    presidentEmail: "yearbook4567@mydusd.org",
    advisorName: "Ms. Photo",
    meetingDays: "Every Monday and Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "N-102",
    category: "Leadership" as ClubCategory,
    description: "Create the school yearbook and capture memories."
  },
  {
    name: "Yoga Club",
    presidentName: "Zen Master",
    presidentEmail: "yoga5678@mydusd.org",
    advisorName: "PE Teacher Flex",
    meetingDays: "Every Tuesday and Thursday",
    meetingTime: "Morning",
    meetingRoom: "Dance Studio",
    category: "Sports" as ClubCategory,
    description: "Practice yoga for fitness and mindfulness."
  },
  {
    name: "Young Democrats Club",
    presidentName: "Political Student",
    presidentEmail: "democrats3456@mydusd.org",
    advisorName: "History Teacher",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-210",
    category: "Leadership" as ClubCategory,
    description: "Discuss democratic politics and civic engagement."
  },
  {
    name: "Young Republicans Club",
    presidentName: "Conservative Student",
    presidentEmail: "republicans4567@mydusd.org",
    advisorName: "Social Studies Teacher",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-212",
    category: "Leadership" as ClubCategory,
    description: "Discuss republican politics and conservative values."
  },
  {
    name: "Zoology Club",
    presidentName: "Animal Lover",
    presidentEmail: "zoology5678@mydusd.org",
    advisorName: "Biology Teacher",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "J-106",
    category: "STEM" as ClubCategory,
    description: "Study animals and wildlife conservation."
  },
  {
    name: "Astronomy Club",
    presidentName: "Star Gazer",
    presidentEmail: "astronomy3456@mydusd.org",
    advisorName: "Physics Teacher",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Evening",
    meetingRoom: "Observatory",
    category: "STEM" as ClubCategory,
    description: "Observe celestial objects and learn about space."
  },
  {
    name: "Badminton Club",
    presidentName: "Racket Master",
    presidentEmail: "badminton4567@mydusd.org",
    advisorName: "Gym Teacher",
    meetingDays: "Every Monday",
    meetingTime: "After School",
    meetingRoom: "Gym",
    category: "Sports" as ClubCategory,
    description: "Play badminton and improve racket skills."
  },
  {
    name: "Book Club",
    presidentName: "Avid Reader",
    presidentEmail: "bookclub5678@mydusd.org",
    advisorName: "Librarian",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "Library",
    category: "Academic" as ClubCategory,
    description: "Read and discuss literature together."
  },
  {
    name: "Bowling Club",
    presidentName: "Strike King",
    presidentEmail: "bowling3456@mydusd.org",
    advisorName: "Activities Director",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "After School",
    meetingRoom: "Local Bowling Alley",
    category: "Sports" as ClubCategory,
    description: "Practice bowling and compete in leagues."
  },
  {
    name: "Bridge Club",
    presidentName: "Card Shark",
    presidentEmail: "bridge4567@mydusd.org",
    advisorName: "Math Teacher",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-204",
    category: "Hobbies" as ClubCategory,
    description: "Learn and play the card game bridge."
  },
  {
    name: "Calligraphy Club",
    presidentName: "Artistic Writer",
    presidentEmail: "calligraphy5678@mydusd.org",
    advisorName: "Art Teacher",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "Art Room",
    category: "Arts" as ClubCategory,
    description: "Practice beautiful handwriting and lettering arts."
  },
  {
    name: "Ceramics Club",
    presidentName: "Clay Artist",
    presidentEmail: "ceramics3456@mydusd.org",
    advisorName: "Art Instructor",
    meetingDays: "Every Thursday",
    meetingTime: "After School",
    meetingRoom: "Art Studio",
    category: "Arts" as ClubCategory,
    description: "Create pottery and ceramic artwork."
  },
  {
    name: "Choir Club",
    presidentName: "Lead Singer",
    presidentEmail: "choir4567@mydusd.org",
    advisorName: "Music Director",
    meetingDays: "Every Tuesday and Thursday",
    meetingTime: "After School",
    meetingRoom: "Music Hall",
    category: "Arts" as ClubCategory,
    description: "Sing in harmony and perform choral music."
  },
  {
    name: "Coding Bootcamp",
    presidentName: "Tech Wizard",
    presidentEmail: "coding5678@mydusd.org",
    advisorName: "Computer Science Teacher",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "After School",
    meetingRoom: "Computer Lab",
    category: "STEM" as ClubCategory,
    description: "Intensive programming training and projects."
  },
  {
    name: "Comic Book Club",
    presidentName: "Comic Fan",
    presidentEmail: "comics3456@mydusd.org",
    advisorName: "English Teacher",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-206",
    category: "Hobbies" as ClubCategory,
    description: "Read, discuss, and create comic books."
  },
  {
    name: "Cooking Club",
    presidentName: "Master Chef",
    presidentEmail: "cooking4567@mydusd.org",
    advisorName: "Home Ec Teacher",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "After School",
    meetingRoom: "Kitchen",
    category: "Hobbies" as ClubCategory,
    description: "Learn cooking techniques and prepare delicious meals."
  },
  {
    name: "Creative Writing Club",
    presidentName: "Story Teller",
    presidentEmail: "writing5678@mydusd.org",
    advisorName: "English Instructor",
    meetingDays: "Every Monday",
    meetingTime: "Lunch",
    meetingRoom: "M-207",
    category: "Arts" as ClubCategory,
    description: "Write fiction, poetry, and creative pieces."
  },
  {
    name: "Cycling Club",
    presidentName: "Bike Enthusiast",
    presidentEmail: "cycling3456@mydusd.org",
    advisorName: "PE Instructor",
    meetingDays: "2nd and 4th Saturday",
    meetingTime: "Morning",
    meetingRoom: "Bike Rack Area",
    category: "Sports" as ClubCategory,
    description: "Organize group bike rides and cycling events."
  },
  {
    name: "Dance Club",
    presidentName: "Dance Captain",
    presidentEmail: "dance4567@mydusd.org",
    advisorName: "Dance Teacher",
    meetingDays: "Every Wednesday and Friday",
    meetingTime: "After School",
    meetingRoom: "Dance Studio",
    category: "Arts" as ClubCategory,
    description: "Learn various dance styles and perform."
  },
  {
    name: "Dungeons & Dragons Club",
    presidentName: "Dungeon Master",
    presidentEmail: "dnd5678@mydusd.org",
    advisorName: "Fantasy Fan Teacher",
    meetingDays: "Every Saturday",
    meetingTime: "Afternoon",
    meetingRoom: "L-115",
    category: "Hobbies" as ClubCategory,
    description: "Play D&D campaigns and role-playing games."
  },
  {
    name: "Entrepreneurship Club",
    presidentName: "Business Mind",
    presidentEmail: "entrepreneur3456@mydusd.org",
    advisorName: "Business Teacher",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "Business Room",
    category: "Business" as ClubCategory,
    description: "Learn about starting and running businesses."
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