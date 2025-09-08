import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Search, Heart, Calendar, Users, Sparkles, LogOut } from "lucide-react-native";

import Colors from "@/constants/colors";
import ClubCard from "@/components/ClubCard";
import MeetingItem from "@/components/MeetingItem";
import { useAuth } from "@/store/auth";
import { trpc } from "@/lib/trpc";

export default function HomeScreen() {
  const router = useRouter();
  const { user, totalUsers, logout } = useAuth();
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  
  const clubsQuery = trpc.clubs.getAll.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const clubs = clubsQuery.data || [];
  
  useEffect(() => {
    // No upcoming meetings for now since we removed fake data
    setUpcomingMeetings([]);
  }, []);
  
  // Get featured clubs (first 3 clubs)
  const featuredClubs = clubs.slice(0, 3);
  
  const handleExplorePress = () => {
    router.push("/explore");
  };
  
  const handleFavoritesPress = () => {
    router.push("/favorites");
  };
  
  const handleCalendarPress = () => {
    router.push("/calendar");
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <View>
            <View style={styles.heroIcon}>
              <Sparkles size={32} color={Colors.primary} />
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.heroTitle}>Club Central</Text>
        <Text style={styles.heroSubtitle}>
          Welcome {user?.name}! Discover and connect with all the amazing clubs on campus.
        </Text>
        <Text style={styles.userInfo}>
          Role: {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Club President' : 'Student'}
        </Text>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable style={styles.actionCard} onPress={handleExplorePress}>
          <View style={styles.actionIcon}>
            <Search size={24} color={Colors.primary} />
          </View>
          <Text style={styles.actionTitle}>Explore Clubs</Text>
          <Text style={styles.actionSubtitle}>Browse all {clubs.length} clubs</Text>
        </Pressable>
        
        <Pressable style={styles.actionCard} onPress={handleFavoritesPress}>
          <View style={styles.actionIcon}>
            <Heart size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.actionTitle}>My Favorites</Text>
          <Text style={styles.actionSubtitle}>Quick access</Text>
        </Pressable>
        
        <Pressable style={styles.actionCard} onPress={handleCalendarPress}>
          <View style={styles.actionIcon}>
            <Calendar size={24} color={Colors.primary} />
          </View>
          <Text style={styles.actionTitle}>Meetings</Text>
          <Text style={styles.actionSubtitle}>Upcoming events</Text>
        </Pressable>
      </View>
      
      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Users size={20} color={Colors.primary} />
          <Text style={styles.statNumber}>{totalUsers}</Text>
          <Text style={styles.statLabel}>App Users</Text>
        </View>
        <View style={styles.statCard}>
          <Sparkles size={20} color={Colors.secondary} />
          <Text style={styles.statNumber}>{clubs.length}</Text>
          <Text style={styles.statLabel}>Active Clubs</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.statNumber}>{upcomingMeetings.length}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>
      
      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Happening Soon</Text>
            <Pressable onPress={handleCalendarPress}>
              <Text style={styles.sectionLink}>View All</Text>
            </Pressable>
          </View>
          {upcomingMeetings.map((item, index) => (
            <MeetingItem 
              key={`${item.club.id}-${index}`}
              club={item.club}
              meeting={item.meeting}
            />
          ))}
        </View>
      )}
      
      {/* Featured Clubs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Clubs</Text>
          <Pressable onPress={handleExplorePress}>
            <Text style={styles.sectionLink}>Explore All</Text>
          </Pressable>
        </View>
        {featuredClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}10`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
  },
  sectionLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
});