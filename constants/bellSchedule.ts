export interface BellSchedule {
  [key: string]: {
    startTime: string;
    endTime: string;
  };
}

// Bell schedules for different days
export const BELL_SCHEDULES: { [key: string]: BellSchedule } = {
  // Monday - All Classes
  Monday: {
    'Period 0': { startTime: '7:15 AM', endTime: '8:15 AM' },
    '1st Period': { startTime: '8:30 AM', endTime: '9:22 AM' },
    '2nd Period': { startTime: '9:28 AM', endTime: '10:20 AM' },
    '3rd Period': { startTime: '10:26 AM', endTime: '11:18 AM' },
    '4th Period': { startTime: '11:24 AM', endTime: '12:16 PM' },
    'Lunch': { startTime: '12:16 PM', endTime: '12:51 PM' },
    '5th Period': { startTime: '12:57 PM', endTime: '1:49 PM' },
    '6th Period': { startTime: '1:55 PM', endTime: '2:47 PM' },
    '7th Period': { startTime: '2:53 PM', endTime: '3:45 PM' }
  },
  
  // Tuesday/Thursday - Odd Day
  Tuesday: {
    'Period 0': { startTime: '7:15 AM', endTime: '8:15 AM' },
    '1st Period': { startTime: '8:30 AM', endTime: '10:06 AM' },
    '3rd Period': { startTime: '10:12 AM', endTime: '11:48 AM' },
    'Lunch': { startTime: '11:48 AM', endTime: '12:21 PM' },
    '5th Period': { startTime: '12:27 PM', endTime: '2:03 PM' },
    '7th Period': { startTime: '2:09 PM', endTime: '3:45 PM' }
  },
  
  Thursday: {
    'Period 0': { startTime: '7:15 AM', endTime: '8:15 AM' },
    '1st Period': { startTime: '8:30 AM', endTime: '10:06 AM' },
    '3rd Period': { startTime: '10:12 AM', endTime: '11:48 AM' },
    'Lunch': { startTime: '11:48 AM', endTime: '12:21 PM' },
    '5th Period': { startTime: '12:27 PM', endTime: '2:03 PM' },
    '7th Period': { startTime: '2:09 PM', endTime: '3:45 PM' }
  },
  
  // Wednesday - Even Day
  Wednesday: {
    'Collaboration (Staff)': { startTime: '8:00 AM', endTime: '9:00 AM' },
    '2nd Period': { startTime: '9:00 AM', endTime: '10:36 AM' },
    '4th Period': { startTime: '10:42 AM', endTime: '12:23 PM' },
    'Lunch': { startTime: '12:23 PM', endTime: '1:03 PM' },
    '6th Period': { startTime: '1:09 PM', endTime: '2:45 PM' }
  },
  
  // Wednesday Even Day - Modified Schedule (Grady Days)
  WednesdayModified: {
    'Collaboration (Staff)': { startTime: '8:00 AM', endTime: '8:55 AM' },
    '2nd Period': { startTime: '9:00 AM', endTime: '10:36 AM' },
    'Rally/Event': { startTime: '10:42 AM', endTime: '11:42 AM' },
    'Lunch': { startTime: '11:42 AM', endTime: '12:20 PM' },
    '4th Period': { startTime: '12:27 PM', endTime: '2:03 PM' },
    '6th Period': { startTime: '2:09 PM', endTime: '3:45 PM' }
  },
  
  // Friday - Even Day
  Friday: {
    'Period 0': { startTime: '7:15 AM', endTime: '8:15 AM' },
    '2nd Period': { startTime: '8:30 AM', endTime: '10:06 AM' },
    '4th Period': { startTime: '10:12 AM', endTime: '11:53 AM' },
    'Lunch': { startTime: '11:53 AM', endTime: '12:38 PM' },
    '6th Period': { startTime: '12:44 PM', endTime: '2:20 PM' }
  }
};

// Function to get lunch time for a specific day
export const getLunchTime = (dayOfWeek: string): { startTime: string; endTime: string } => {
  const schedule = BELL_SCHEDULES[dayOfWeek] || BELL_SCHEDULES.Monday;
  return schedule.Lunch || { startTime: '12:16 PM', endTime: '12:51 PM' };
};

// Function to convert 12-hour format to 24-hour format for sorting
export const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  return `${hours.padStart(2, '0')}:${minutes}`;
};

// Function to get meeting time based on day and meeting time preference
export const getMeetingTime = (dayOfWeek: string, meetingTimePreference: string): { startTime: string; endTime: string } => {
  if (meetingTimePreference === 'Lunch' || meetingTimePreference === '') {
    return getLunchTime(dayOfWeek);
  }
  
  // For specific times like "3:00 PM", return as is with 1 hour duration
  if (meetingTimePreference.includes('PM') || meetingTimePreference.includes('AM')) {
    const startTime24 = convertTo24Hour(meetingTimePreference);
    const [hours, minutes] = startTime24.split(':');
    const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
    const endTime24 = `${endHour}:${minutes}`;
    
    // Convert back to 12-hour format
    const formatTime = (time24: string) => {
      const [h, m] = time24.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${m} ${ampm}`;
    };
    
    return {
      startTime: meetingTimePreference,
      endTime: formatTime(endTime24)
    };
  }
  
  // Default to lunch time
  return getLunchTime(dayOfWeek);
};