import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
import Colors from "@/constants/colors";
import MeetingItem from "@/components/MeetingItem";
import EmptyState from "@/components/EmptyState";
import { Calendar } from "lucide-react-native";
import { trpc } from "@/lib/trpc";

export default function CalendarScreen() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  
  const clubsQuery = trpc.clubs.getAll.useQuery();
  
  useEffect(() => {
    if (!clubsQuery.data) return;
    
    // Generate upcoming meetings based on club meeting days
    const allMeetings: any[] = [];
    
    clubsQuery.data.forEach(club => {
      // For now, we'll show empty calendar since no specific meeting dates are set
      // Clubs can add specific meeting dates through their admin interface
    });
    
    setMeetings(allMeetings);
    setSections([]);
  }, [clubsQuery.data]);
  
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
    <View style={styles.container}>
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