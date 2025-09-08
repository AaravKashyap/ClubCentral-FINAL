import { Club, ClubCategory, MeetingFrequency } from "@/types/club";
import { getMeetingTime } from "@/constants/bellSchedule";

const generateMeetings = (
  count: number, 
  day: string, 
  startTime: string, 
  endTime: string, 
  location: string,
  frequency: MeetingFrequency,
  meetingPattern: string
): any[] => {
  const meetings = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
  
  // Generate meetings for the next 6 months
  const monthsToGenerate = 6;
  
  for (let monthOffset = 0; monthOffset < monthsToGenerate; monthOffset++) {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = daysOfWeek.indexOf(day);
    
    if (targetDayIndex !== -1) {
      // Find all occurrences of the target day in the month
      const occurrences: Date[] = [];
      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
      
      for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayOfMonth);
        if (date.getDay() === targetDayIndex) {
          occurrences.push(date);
        }
      }
      
      // Filter based on meeting pattern
      let selectedDates: Date[] = [];
      
      if (frequency === 'Weekly' || meetingPattern.includes('Every')) {
        selectedDates = occurrences;
      } else if (frequency === 'Bi-weekly') {
        if (meetingPattern.includes('1st and 3rd')) {
          // Select 1st and 3rd occurrence (index 0 and 2)
          if (occurrences[0]) selectedDates.push(occurrences[0]);
          if (occurrences[2]) selectedDates.push(occurrences[2]);
        } else if (meetingPattern.includes('2nd and 4th')) {
          // Select 2nd and 4th occurrence (index 1 and 3)
          if (occurrences[1]) selectedDates.push(occurrences[1]);
          if (occurrences[3]) selectedDates.push(occurrences[3]);
        }
      }
      
      // Add meetings that are in the future
      for (const date of selectedDates) {
        const meetingDate = new Date(date);
        meetingDate.setHours(0, 0, 0, 0);
        
        if (meetingDate >= today) {
          meetings.push({
            date: date.toISOString().split("T")[0],
            startTime,
            endTime,
            location,
            description: monthOffset === 0 ? "Regular club meeting" : undefined,
            id: `${date.toISOString().split("T")[0]}-${startTime}`,
            cancelled: false
          });
          
          if (meetings.length >= count) break;
        }
      }
    }
    
    if (meetings.length >= count) break;
  }
  
  return meetings.slice(0, count);
};

// Function to determine category based on club name
const determineCategory = (name: string): ClubCategory => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('stem') || lowerName.includes('science') || lowerName.includes('math') || 
      lowerName.includes('physics') || lowerName.includes('chemistry') || lowerName.includes('biology') || 
      lowerName.includes('computer') || lowerName.includes('engineering') || lowerName.includes('aerospace') || 
      lowerName.includes('data') || lowerName.includes('quantum') || lowerName.includes('neuroscience') ||
      lowerName.includes('coding') || lowerName.includes('programming') || lowerName.includes('robotics') ||
      lowerName.includes('3d printing') || lowerName.includes('animation')) {
    return 'STEM';
  }
  
  if (lowerName.includes('art') || lowerName.includes('animation') || lowerName.includes('photography') || 
      lowerName.includes('poetry') || lowerName.includes('drama') || lowerName.includes('music') || 
      lowerName.includes('film') || lowerName.includes('theater') || lowerName.includes('dance') ||
      lowerName.includes('choir') || lowerName.includes('band') || lowerName.includes('orchestra')) {
    return 'Arts';
  }
  
  if (lowerName.includes('sports') || lowerName.includes('archery') || lowerName.includes('badminton') || 
      lowerName.includes('spikeball') || lowerName.includes('taekwondo') || lowerName.includes('yoga') || 
      lowerName.includes('hiking') || lowerName.includes('tennis') || lowerName.includes('volleyball') ||
      lowerName.includes('athletes') || lowerName.includes('swimming') || lowerName.includes('basketball') ||
      lowerName.includes('soccer') || lowerName.includes('football') || lowerName.includes('track') ||
      lowerName.includes('cross country') || lowerName.includes('wrestling') || lowerName.includes('gymnastics')) {
    return 'Sports';
  }
  
  if (lowerName.includes('community service') || lowerName.includes('kindness') || lowerName.includes('adopt') || 
      lowerName.includes('changemakers') || lowerName.includes('fcsn') || lowerName.includes('red cross') || 
      lowerName.includes('unicef') || lowerName.includes('interact') || lowerName.includes('key club') || 
      lowerName.includes('best buddies') || lowerName.includes('volunteer') || lowerName.includes('service') ||
      lowerName.includes('charity') || lowerName.includes('helping') || lowerName.includes('aid') ||
      lowerName.includes('environmental') || lowerName.includes('recycling') || lowerName.includes('climate')) {
    return 'Community Service';
  }
  
  if (lowerName.includes('cultural') || lowerName.includes('afghan') || lowerName.includes('asian') || 
      lowerName.includes('cantonese') || lowerName.includes('indian') || lowerName.includes('french') || 
      lowerName.includes('latin') || lowerName.includes('vietnamese') || lowerName.includes('taiwanese') || 
      lowerName.includes('slavic') || lowerName.includes('filipino') || lowerName.includes('muslim') || 
      lowerName.includes('black student union') || lowerName.includes('latinos unidos') || 
      lowerName.includes('spanish') || lowerName.includes('chinese') || lowerName.includes('japanese') ||
      lowerName.includes('korean') || lowerName.includes('german') || lowerName.includes('italian') ||
      lowerName.includes('russian') || lowerName.includes('arabic') || lowerName.includes('hebrew') ||
      lowerName.includes('portuguese') || lowerName.includes('swedish') || lowerName.includes('dutch')) {
    return 'Cultural';
  }
  
  if (lowerName.includes('academic') || lowerName.includes('math') || lowerName.includes('debate') || 
      lowerName.includes('mock trial') || lowerName.includes('speech') || lowerName.includes('quizbowl') || 
      lowerName.includes('csf') || lowerName.includes('national honor society') || lowerName.includes('honor society') ||
      lowerName.includes('tutoring') || lowerName.includes('study') || lowerName.includes('academic') ||
      lowerName.includes('scholarship') || lowerName.includes('test prep') || lowerName.includes('competition')) {
    return 'Academic';
  }
  
  if (lowerName.includes('business') || lowerName.includes('deca') || lowerName.includes('finance') || 
      lowerName.includes('entrepreneurship') || lowerName.includes('economics') || lowerName.includes('marketing') ||
      lowerName.includes('investment') || lowerName.includes('stock') || lowerName.includes('trading')) {
    return 'Business';
  }
  
  if (lowerName.includes('hobbies') || lowerName.includes('lego') || lowerName.includes('rubik') || 
      lowerName.includes('trading card') || lowerName.includes('dungeons and dragons') || lowerName.includes('d&d') ||
      lowerName.includes('board games') || lowerName.includes('puzzles') || lowerName.includes('crafts') ||
      lowerName.includes('knitting') || lowerName.includes('sewing') || lowerName.includes('gardening') ||
      lowerName.includes('cooking') || lowerName.includes('baking') || lowerName.includes('photography') ||
      lowerName.includes('scrapbooking')) {
    return 'Hobbies';
  }
  
  if (lowerName.includes('leadership') || lowerName.includes('student government') || lowerName.includes('asb') ||
      lowerName.includes('student council') || lowerName.includes('leadership') || lowerName.includes('president') ||
      lowerName.includes('officer')) {
    return 'Leadership';
  }
  
  return 'Other';
};

// Function to determine meeting frequency and day
const parseMeetingInfo = (meetingDays: string) => {
  let meetingFrequency: MeetingFrequency = 'Weekly';
  let meetingDay = '';
  let meetingCount = 24; // Generate for 6 months
  
  // Handle special cases like Trading Card Club with multiple patterns
  if (meetingDays.includes('1st and 3rd') && meetingDays.includes('2nd and 4th')) {
    // This club meets every week (both 1st/3rd and 2nd/4th)
    meetingFrequency = 'Weekly';
    meetingCount = 24;
  } else if (meetingDays.includes('1st and 3rd') || meetingDays.includes('2nd and 4th')) {
    meetingFrequency = 'Bi-weekly';
    meetingCount = 12; // 6 months * 2 per month
  } else if (meetingDays.includes('Every')) {
    meetingFrequency = 'Weekly';
    meetingCount = 24; // 6 months * 4 per month
  }
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    if (meetingDays.includes(day)) {
      meetingDay = day;
      break;
    }
  }
  
  return { meetingFrequency, meetingDay, meetingCount, meetingPattern: meetingDays };
};

// Real club data from provided information
const realClubData = [
  {
    name: "3D Printing and Animation Club",
    presidentName: "Pranav Vinod",
    presidentEmail: "vinod2553@mydusd.org",
    advisorName: "Chris Meyer",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "",
    meetingRoom: "N-108"
  },
  {
    name: "Acts of Random Kindness Club",
    presidentName: "Khang Fung",
    presidentEmail: "fung9424@mydusd.org",
    advisorName: "Jason Morganstein",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "F-201"
  },
  {
    name: "Aerospace Club",
    presidentName: "Sohail Kazi",
    presidentEmail: "kazi1290@mydusd.org",
    advisorName: "Jeanne Morgan",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "F-305"
  },
  {
    name: "Afghan Student Association",
    presidentName: "Sahara Salemi",
    presidentEmail: "salemi3165@mydusd.org",
    advisorName: "Mike Ruegg",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-211"
  },
  {
    name: "Animation Club",
    presidentName: "Tina Lin",
    presidentEmail: "lin3225@mydusd.org",
    advisorName: "Chris Meyer",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "N-108"
  },
  {
    name: "Archery Club",
    presidentName: "Eujin Michelle Low",
    presidentEmail: "low5021@mydusd.org",
    advisorName: "Neilson Vuong",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-204"
  },
  {
    name: "Art Club",
    presidentName: "Emaan Qayyum and Ryan Cho",
    presidentEmail: "qayyum1361@mydusd.org",
    advisorName: "Noel Sollom",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "N-101"
  },
  {
    name: "Asian Student Association",
    presidentName: "Phoebe Yee & Yena Lee",
    presidentEmail: "yee2852@mydusd.org",
    advisorName: "Celine Shi",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "M-204"
  },
  {
    name: "AstroGaels",
    presidentName: "Suraj R Kudrikar",
    presidentEmail: "kudrikar1327@mydusd.org",
    advisorName: "Jon White",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "F-304"
  },
  {
    name: "BC2M",
    presidentName: "Yashita Vijay",
    presidentEmail: "vijay3568@mydusd.org",
    advisorName: "Kelly Gambs",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "J-103"
  },
  {
    name: "Best Buddies",
    presidentName: "Lexi Esquivel",
    presidentEmail: "esquivel9503@mydusd.org",
    advisorName: "Lu Middleton",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-105"
  },
  {
    name: "California Scholarship Federation (CSF)",
    presidentName: "CJ Galang",
    presidentEmail: "galang2959@mydusd.org",
    advisorName: "Kim Halket",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "Sports Complex"
  },
  {
    name: "Cantonese Student Association",
    presidentName: "Audrey Tang",
    presidentEmail: "tang2416@mydusd.org",
    advisorName: "Jaclyn Capie",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-102"
  },
  {
    name: "Chemistry Club",
    presidentName: "Jonathan Song",
    presidentEmail: "song5227@mydusd.org",
    advisorName: "Michael Correia",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "K-203"
  },
  {
    name: "CodeHers",
    presidentName: "Alicia Wang and Danica Truong",
    presidentEmail: "wang0838@mydusd.org",
    advisorName: "Mitsuka Bude",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "F-307"
  },
  {
    name: "Data Science Club",
    presidentName: "Ryan Lee",
    presidentEmail: "lee2830@mydusd.org",
    advisorName: "Matthew Janisch",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "L-112"
  },
  {
    name: "DHS 4 The Athletes",
    presidentName: "Tarun Tiwari",
    presidentEmail: "tiwari5235@mydusd.org",
    advisorName: "Tom Costello",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "Weight Room"
  },
  {
    name: "DHS Adopt a Family",
    presidentName: "Aanya Srivastava",
    presidentEmail: "srivastava2784@mydusd.org",
    advisorName: "Brian Do",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-210"
  },
  {
    name: "DHS Avani",
    presidentName: "Rithika Lakshmi",
    presidentEmail: "lakshmi6820@mydusd.org",
    advisorName: "Brittany Neideffer",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-210"
  },
  {
    name: "DHS Biology Club",
    presidentName: "Brianna Huang",
    presidentEmail: "huang3012@mydusd.org",
    advisorName: "Erica Lee",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-105"
  },
  {
    name: "DHS ChangeMakers",
    presidentName: "Hasini Shivakumar",
    presidentEmail: "Shivakumar3443@mydusd.org",
    advisorName: "Silvia Sosa",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-108"
  },
  {
    name: "DHS FCSN",
    presidentName: "Joshua Wu",
    presidentEmail: "wu2886@mydusd.org",
    advisorName: "Dan Poulos",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-102"
  },
  {
    name: "DHS Game Development Club",
    presidentName: "Pranav Peethani",
    presidentEmail: "peethani2813@mydusd.org",
    advisorName: "Chris Meyer",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "N-108"
  },
  {
    name: "DHS Lego Club",
    presidentName: "Jack Zhou",
    presidentEmail: "zhou7162@mydusd.org",
    advisorName: "Brian Do",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "J-210"
  },
  {
    name: "DHS Math Club",
    presidentName: "Sophia Henningsen",
    presidentEmail: "henningsen3629@mydusd.org",
    advisorName: "Elena Tigner",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-208"
  },
  {
    name: "DHS Photography Club",
    presidentName: "Lucas Farmer",
    presidentEmail: "farmer4501@mydusd.org",
    advisorName: "Arzoo Nasarabadi",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "K-204"
  },
  {
    name: "DHS Poetry",
    presidentName: "Prisha Viswanadha",
    presidentEmail: "viswanadha4696@mydusd.org",
    advisorName: "Brandon Youngsma",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "M-203"
  },
  {
    name: "DHS Psychology Club",
    presidentName: "Radhika Mathur & Brianna Huang",
    presidentEmail: "mathur8269@mydusd.org",
    advisorName: "Jessica Russell",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-103"
  },
  {
    name: "DHS Quantum Computing Club",
    presidentName: "Anay Chokhani",
    presidentEmail: "chokhani0958@mydusd.org",
    advisorName: "Daniel Olivas",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-104"
  },
  {
    name: "DHS Spikeball Club",
    presidentName: "Alivia Farmer",
    presidentEmail: "farmer4500@mydusd.org",
    advisorName: "Juliana Bremer",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-212"
  },
  {
    name: "DHS Technical Theater Club",
    presidentName: "Rachana Paladugu, Caitlyn Wong",
    presidentEmail: "paladugu4269@mydusd.org",
    advisorName: "Edward Hightower",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "PAC Lobby"
  },
  {
    name: "DHS Women in STEM",
    presidentName: "Mahi Dalal",
    presidentEmail: "dalal1478@mydusd.org",
    advisorName: "Matt Janisch",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-112"
  },
  {
    name: "Drama Club",
    presidentName: "Rishan Sathiyaa",
    presidentEmail: "sathiyaa6756@mydusd.org",
    advisorName: "Edward Hightower",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "C-116"
  },
  {
    name: "Dublin Afsana",
    presidentName: "Aadhya Bogadi (Captain)",
    presidentEmail: "bogadi8183@mydusd.org",
    advisorName: "Michael Correia",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "K-203"
  },
  {
    name: "Dublin Badminton Club",
    presidentName: "Kristie Leung",
    presidentEmail: "leung4104@mydusd.org",
    advisorName: "Amy Lopez",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "Old Gym"
  },
  {
    name: "Dublin Computer Science Club",
    presidentName: "Kaushik Chadolu",
    presidentEmail: "chandolu2897@mydusd.org",
    advisorName: "Scott Wojacynski",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-110"
  },
  {
    name: "Dublin DECA",
    presidentName: "Ekam Dhot",
    presidentEmail: "dhot8379@mydusd.org",
    advisorName: "Bailey Udoutch",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "F-206"
  },
  {
    name: "Dublin High Mock Trial",
    presidentName: "Harveer Saini",
    presidentEmail: "saini8304@mydusd.org",
    advisorName: "Jeff Taylor",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-108"
  },
  {
    name: "Dublin High School Speech & Debate",
    presidentName: "Harveer Saini",
    presidentEmail: "saini8304@mydusd.org",
    advisorName: "Nathaniel Grim",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "M-202"
  },
  {
    name: "Dublin High School Two Birds Club",
    presidentName: "Manlika Pal",
    presidentEmail: "pal3274@mydusd.org",
    advisorName: "Kelly Aguiar",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-101"
  },
  {
    name: "Dublin Interact",
    presidentName: "Siqi Li",
    presidentEmail: "li3647@mydusd.org",
    advisorName: "Shannon Persley",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "N-107"
  },
  {
    name: "Dublin Living Outside",
    presidentName: "Kartheeka Namburu",
    presidentEmail: "namburu2654@mydusd.org",
    advisorName: "Kate Maurer",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "J-202"
  },
  {
    name: "Dublin MEDLIFE",
    presidentName: "Avantika Raavi & Shruthi Valliappan",
    presidentEmail: "raavi5600@mydusd.org",
    advisorName: "Kelly Gambs",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "J-203"
  },
  {
    name: "Dublin UNICEF",
    presidentName: "Aadhya Bogadi",
    presidentEmail: "bogadi8183@mydusd.org",
    advisorName: "Rich Hernandez",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-111"
  },
  {
    name: "Dungeons and Dragons Club",
    presidentName: "Cameron Genest",
    presidentEmail: "genest7813@mydusd.org",
    advisorName: "Mitchell Kless",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "J-205"
  },
  {
    name: "Economics and Technology Society",
    presidentName: "Jaanya Gupta and Bea Rarangol",
    presidentEmail: "rarangol9163@mydusd.org",
    advisorName: "Alissa Power",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "J-101"
  },
  {
    name: "Engineering Club",
    presidentName: "Temuulen Burrows",
    presidentEmail: "burrows5333@mydusd.org",
    advisorName: "Eugene Chou",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "F-103"
  },
  {
    name: "FCCLA",
    presidentName: "Amy Moreno-Luna",
    presidentEmail: "morenoluna1262@mydusd.org",
    advisorName: "Slavec Nichole",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "3:00 PM",
    meetingRoom: "H-07"
  },
  {
    name: "Filipino American Student Union (FASU)",
    presidentName: "Kheandra Suarez",
    presidentEmail: "suarez3466@mydusd.org",
    advisorName: "Trevor Johnston",
    meetingDays: "Every Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "K-202"
  },
  {
    name: "Filmmaker's Club",
    presidentName: "Christian Campbell",
    presidentEmail: "campbell5712@mydusd.org",
    advisorName: "Martin Glickman",
    meetingDays: "Every Friday",
    meetingTime: "Lunch",
    meetingRoom: "C-121"
  },
  {
    name: "Financial Literacy Club",
    presidentName: "Veera Desale",
    presidentEmail: "desale4971@mydusd.org",
    advisorName: "Nadine Medeiros",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "J-107"
  },
  {
    name: "French Club",
    presidentName: "Anishka Vora",
    presidentEmail: "vora3237@mydusd.org",
    advisorName: "Claude Isaac",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-101"
  },
  {
    name: "Friends in Serving Him (FISH) Club",
    presidentName: "Jayden Lee",
    presidentEmail: "lee5472@mydusd.org",
    advisorName: "Dan Arnold",
    meetingDays: "Every Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-111"
  },
  {
    name: "Gender Sexuality Alliance",
    presidentName: "Emaan Qayyum",
    presidentEmail: "qayyum1361@mydusd.org",
    advisorName: "Claire Yackley",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "C-120"
  },
  {
    name: "Generation Code",
    presidentName: "Veer Gill, Jayden Lee",
    presidentEmail: "gill4890@mydusd.org",
    advisorName: "Jasneet Matta",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "F-105"
  },
  {
    name: "Girls Who Code",
    presidentName: "Alicia Wang",
    presidentEmail: "wang0838@mydusd.org",
    advisorName: "Emily Hurd",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "K-108"
  },
  {
    name: "Girls4Sports",
    presidentName: "Shreeya Rao Lalam, Arshia Singh",
    presidentEmail: "lalam4994@mydusd.org",
    advisorName: "Bidjan Aminian",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-104"
  },
  {
    name: "Heartfelt Connections Club",
    presidentName: "Chenxi (Michelle) Dou",
    presidentEmail: "dou2662@mydusd.org",
    advisorName: "Hae Sol Park",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "J-104"
  },
  {
    name: "HOSA",
    presidentName: "Charlotte Ho",
    presidentEmail: "ho3468@mydusd.org",
    advisorName: "Julianne Sundstrom",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "F-208 or F-305"
  },
  {
    name: "Improv Club",
    presidentName: "Rishan Sathiyaa",
    presidentEmail: "sathiyaa6756@mydusd.org",
    advisorName: "Edward Hightower",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "C-116"
  },
  {
    name: "Indian Student Association",
    presidentName: "Prisha Ayachit",
    presidentEmail: "ayachit4591@mydusd.org",
    advisorName: "Nathaniel Grim",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-202"
  },
  {
    name: "Key Club",
    presidentName: "Nidzenrah \"Calyx\" Pacio",
    presidentEmail: "pacio3208@mydusd.org",
    advisorName: "Ashley Sheaff",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-213"
  },
  {
    name: "Kindness Bracelets Club",
    presidentName: "Lucy Lagrone",
    presidentEmail: "lagrone0456@mydusd.org",
    advisorName: "Kendon Matkins",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "K-109"
  },
  {
    name: "Latinos Unidos",
    presidentName: "Vanessa Torrano",
    presidentEmail: "torrano3241@mydusd.org",
    advisorName: "Jennifer Ibarria-Gonzalez",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-104"
  },
  {
    name: "Music Matters",
    presidentName: "Yena Lee",
    presidentEmail: "lee1208@mydusd.org",
    advisorName: "Jack Bainton",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "C-119"
  },
  {
    name: "Muslim Student Association",
    presidentName: "Minaal Mokarim",
    presidentEmail: "mokarim0944@mydusd.org",
    advisorName: "Ramany Kaplan",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-206"
  },
  {
    name: "NAMI (National Alliance against Mental Illness)",
    presidentName: "Tanush Gaur",
    presidentEmail: "gaur4987@mydusd.org",
    advisorName: "Ramany Kaplan",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "L-206"
  },
  {
    name: "National Honor Society",
    presidentName: "Cynthia Lin",
    presidentEmail: "lin3223@mydusd.org",
    advisorName: "Neilson Vuong",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "Library and L-204"
  },
  {
    name: "National Honor Society for Dance Arts",
    presidentName: "Mia Starczewski",
    presidentEmail: "starczewski3224@mydusd.org",
    advisorName: "Lauren deLucia",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "E-3"
  },
  {
    name: "Neuroscience Club",
    presidentName: "Sofia Kukricar, Viviana Andrade",
    presidentEmail: "kukricar8436@mydusd.org",
    advisorName: "Jaclyn Capie",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-102"
  },
  {
    name: "NYLA",
    presidentName: "Siddh Rajrishi",
    presidentEmail: "rajrishi4043@mydusd.org",
    advisorName: "Claude Isaac",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-101"
  },
  {
    name: "Physics Club",
    presidentName: "Moon Liu",
    presidentEmail: "liu4390@mydusd.org",
    advisorName: "Audrey Xu",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "M-103"
  },
  {
    name: "Poverty Patch-Up",
    presidentName: "Shivani Ramanathan",
    presidentEmail: "ramanathan1359@mydusd.org",
    advisorName: "Carmen Chan",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-208"
  },
  {
    name: "Psychology's Stage",
    presidentName: "Sristi (Cesi) Malhotra",
    presidentEmail: "malhotra6817@mydusd.org",
    advisorName: "Shannon Smoot",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "Library"
  },
  {
    name: "Red Cross Club",
    presidentName: "Krista Chen",
    presidentEmail: "chen2874@mydusd.org",
    advisorName: "Jennifer Angel-Diaz",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "L-209"
  },
  {
    name: "Rehab Rescue",
    presidentName: "Mahi Patel",
    presidentEmail: "patel5462@mydusd.org",
    advisorName: "Raj Ramchandani",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "J-207"
  },
  {
    name: "Rubik's Cube Club",
    presidentName: "Adhi Jeyappragash",
    presidentEmail: "jeyappragash2876@mydusd.org",
    advisorName: "Sarah Ledford",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "L-111"
  },
  {
    name: "S4T (Students 4 Tutors)",
    presidentName: "Jihu Kim",
    presidentEmail: "kim4962@mydusd.org",
    advisorName: "Allison Malone",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "J-209"
  },
  {
    name: "Science for the Bay",
    presidentName: "Neal Mann",
    presidentEmail: "mann7175@mydusd.org",
    advisorName: "Warren Parker",
    meetingDays: "2nd and 4th Monday",
    meetingTime: "Lunch",
    meetingRoom: "Counseling Office"
  },
  {
    name: "Science Olympiad Club",
    presidentName: "Kylie Wong",
    presidentEmail: "wong2929@mydusd.org",
    advisorName: "Isaiah Mohr",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "K-207"
  },
  {
    name: "Slavic Culture Club",
    presidentName: "Sofiia Predchenko",
    presidentEmail: "predchenko1741@mydusd.org",
    advisorName: "Elena Tigner",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "J-208"
  },
  {
    name: "Sociedad Honoraria Hispánica",
    presidentName: "Haziq Ahmed",
    presidentEmail: "ahmed1098@mydusd.org",
    advisorName: "Jennifer Ibarria-Gonzalez",
    meetingDays: "2nd and 4th Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "M-104"
  },
  {
    name: "Stemprenuer Club",
    presidentName: "Riya, Kelly, Madi",
    presidentEmail: "singh5197@mydusd.org",
    advisorName: "Daniel Olivas",
    meetingDays: "1st and 3rd Friday",
    meetingTime: "Lunch",
    meetingRoom: "K-104"
  },
  {
    name: "Student Climate Corps",
    presidentName: "Tarun Rajesh",
    presidentEmail: "rajesh1685@mydusd.org",
    advisorName: "Isaiah Mohr",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "K-207"
  },
  {
    name: "Student Health Advocates for a Positive Environment (SHAPE)",
    presidentName: "Kylene Wong",
    presidentEmail: "wong3605@mydusd.org",
    advisorName: "Anne Ha",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "F-305"
  },
  {
    name: "Swab4Dublin",
    presidentName: "Anoushka Malhotra",
    presidentEmail: "malhotra1457@mydusd.org",
    advisorName: "Raj Ramachandani",
    meetingDays: "2nd and 4th Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "J-207"
  },
  {
    name: "SWENext",
    presidentName: "Kopal Tare & Shrinidhi Rudrashetty",
    presidentEmail: "tare0970@mydusd.org",
    advisorName: "Brian Schick",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "F-101"
  },
  {
    name: "Swift-as-lit",
    presidentName: "Zaynab Mohammed",
    presidentEmail: "mohammed6183@mydusd.org",
    advisorName: "Brandon Youngsma",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "M-203"
  },
  {
    name: "Taekwondo Club",
    presidentName: "Daniel Ibarria, Aidan Ng",
    presidentEmail: "ibarria4930@mydusd.org",
    advisorName: "Logan Calhoun",
    meetingDays: "1st and 3rd Wednesday",
    meetingTime: "Lunch",
    meetingRoom: "L-205"
  },
  {
    name: "Taiwanese Student Association",
    presidentName: "Austin Lu",
    presidentEmail: "austinlu8@gmail.com",
    advisorName: "Mary Hake",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-109"
  },
  {
    name: "The Black Student Union",
    presidentName: "Haili Smith, Sitara Spivey",
    presidentEmail: "spivey7668@mydusd.org",
    advisorName: "Warren Parker",
    meetingDays: "2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "M-213"
  },
  {
    name: "The Finance Circle",
    presidentName: "Jadon Rybak",
    presidentEmail: "rybak3414@mydusd.org",
    advisorName: "John Parsons",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-211"
  },
  {
    name: "The Her Mind Project",
    presidentName: "Anika Panicker, Baani Gupta",
    presidentEmail: "gupta1399@mydusd.org",
    advisorName: "Kiley Dinis",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "M-201"
  },
  {
    name: "Trading Card Club",
    presidentName: "Cameron Genest",
    presidentEmail: "genest7813@mydusd.org",
    advisorName: "Mitchell Kless",
    meetingDays: "1st and 3rd Wednesday, 2nd and 4th Wednesday, 1st and 3rd Friday, 2nd and 4th Friday",
    meetingTime: "Lunch",
    meetingRoom: "J-205"
  },
  {
    name: "Tri-M Music Honors Society",
    presidentName: "Trisha Bhattacharya & Cathy Chen",
    presidentEmail: "bhattacharya2848@mydusd.org",
    advisorName: "Jack Bainton",
    meetingDays: "1st and 3rd Thursday",
    meetingTime: "Lunch",
    meetingRoom: "C-119"
  },
  {
    name: "TUPE (Tobacco Usage Peer Educators)",
    presidentName: "Hasini Dontula",
    presidentEmail: "dontula1323@mydusd.org",
    advisorName: "Holly Garcia",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "H-6"
  },
  {
    name: "Vietnamese Student Association",
    presidentName: "Zoey Tran and Lac-Anh Nguyen",
    presidentEmail: "tran2392@mydusd.org",
    advisorName: "Mary Hake",
    meetingDays: "2nd and 4th Thursday",
    meetingTime: "Lunch",
    meetingRoom: "L-109"
  },
  {
    name: "Voices For Alzheimer’s",
    presidentName: "Ekagra Dwivedi",
    presidentEmail: "dwivedi5921@mydusd.org",
    advisorName: "Logan Calhoun",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-205"
  },
  {
    name: "Writers' Club",
    presidentName: "Aryan Panigrahi, Ashton Lu",
    presidentEmail: "panigrahi2992@mydusd.org",
    advisorName: "Carmen Chan",
    meetingDays: "1st and 3rd Monday",
    meetingTime: "Lunch",
    meetingRoom: "L-208"
  },
  {
    name: "Young Innovators",
    presidentName: "Susmita Vissapragada",
    presidentEmail: "vissapragada8130@mydusd.org",
    advisorName: "Nicole Slavec",
    meetingDays: "1st and 3rd Tuesday",
    meetingTime: "Lunch",
    meetingRoom: "H-7"
  }
];

export const clubs: Club[] = realClubData.map((data, index) => {
  const category = determineCategory(data.name);
  const { meetingFrequency, meetingDay, meetingCount, meetingPattern } = parseMeetingInfo(data.meetingDays);
  
  // Set meeting time to "Lunch" if not specified or empty
  const meetingTime = data.meetingTime || "Lunch";
  
  // Get proper meeting times based on bell schedule
  const { startTime, endTime } = getMeetingTime(meetingDay, meetingTime);
  
  return {
    id: (index + 1).toString(),
    name: data.name,
    description: `Club description for ${data.name}.`,
    category,
    tags: [data.name.split(" ")[0]],
    advisorName: data.advisorName,
    presidentName: data.presidentName,
    presidentEmail: data.presidentEmail,
    email: `${data.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}@school.edu`,
    meetingFrequency,
    meetingDay,
    meetingLocation: data.meetingRoom,
    imageUrl: null, // Removed fake images
    memberCount: 0, // Not provided, set to 0
    yearFounded: 0, // Not provided, set to 0
    upcomingMeetings: generateMeetings(meetingCount, meetingDay, startTime, endTime, data.meetingRoom, meetingFrequency, meetingPattern),
    requirements: "Open to all interested students",
    socialMedia: {}
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
      if (!meeting.cancelled) {
        allMeetings.push({ club, meeting });
      }
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