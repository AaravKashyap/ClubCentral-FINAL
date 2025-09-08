import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { Club, ClubMeeting } from "@/types/club";

type MeetingItemProps = {
  club: Club;
  meeting: ClubMeeting;
};

export default function MeetingItem({ club, meeting }: MeetingItemProps) {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  const handlePress = () => {
    router.push(`/club/${club.id}`);
  };
  
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(meeting.date)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.clubName}>{club.name}</Text>
        <Text style={styles.time}>
          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
        </Text>
        <Text style={styles.location}>{meeting.location}</Text>
        {meeting.description && (
          <Text style={styles.description}>{meeting.description}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dateContainer: {
    width: 80,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  date: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
    fontStyle: "italic",
  },
});