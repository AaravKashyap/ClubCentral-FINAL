import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import MeetingItem from "@/components/MeetingItem";
import EmptyState from "@/components/EmptyState";
import { Calendar } from "lucide-react-native";
import { getUpcomingMeetings } from "@/mocks/clubs";

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  

  
  useEffect(() => {
    const upcomingMeetings = getUpcomingMeetings(100); // Get more meetings for calendar view
    console.log('Calendar: loaded meetings:', upcomingMeetings.length);
    setMeetings(upcomingMeetings);
    
    // Group meetings by date
    const groupedMeetings = upcomingMeetings.reduce((acc: any, item: any) => {
      const date = item.meeting.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
    
    const sectionsData = Object.keys(groupedMeetings).sort().map(date => {
      // Parse date components to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const meetingDate = new Date(year, month - 1, day); // month is 0-indexed
      return {
        title: meetingDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        data: groupedMeetings[date]
      };
    });
    
    setSections(sectionsData);
  }, []);
  
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Meeting Calendar</Text>
      <Text style={styles.subtitle}>
        {meetings.length} upcoming {meetings.length === 1 ? 'meeting' : 'meetings'}
      </Text>
    </View>
  );
  
  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );
  
  const renderEmptyState = () => (
    <EmptyState
      title="No upcoming meetings"
      message="There are no club meetings scheduled at this time. Check back later or explore clubs to find ones that interest you!"
      icon={<Calendar size={48} color={Colors.textSecondary} />}
    />
  );
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.club.id}-${index}`}
        renderItem={({ item }) => (
          <MeetingItem club={item.club} meeting={item.meeting} />
        )}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={meetings.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.content,
          meetings.length === 0 && styles.emptyContent
        ]}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContent: {
    justifyContent: "center",
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
});