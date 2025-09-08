import React, { useMemo } from "react";
import { StyleSheet, Text, View, Pressable, SectionList } from "react-native";
import { Heart, Search, Users } from "lucide-react-native";
import { useRouter } from "expo-router";

import Colors from "@/constants/colors";
import { useFavoritesStore } from "@/store/favorites";
import ClubCard from "@/components/ClubCard";
import EmptyState from "@/components/EmptyState";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/store/auth";
import { Club } from "@/types/club";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteClubIds } = useFavoritesStore();
  const { user } = useAuth();
  
  const clubsQuery = trpc.clubs.getAll.useQuery();
  const clubs = clubsQuery.data || [];
  
  const userMembershipsQuery = trpc.clubs.getUserMemberships.useQuery(
    undefined,
    { enabled: user?.role === 'student' }
  );
  
  const favoriteClubs = useMemo(() => {
    return clubs.filter(club => favoriteClubIds.includes(club.id));
  }, [clubs, favoriteClubIds]);
  
  const joinedClubs = useMemo(() => {
    if (!userMembershipsQuery.data) return [];
    return clubs.filter(club => userMembershipsQuery.data.includes(club.id));
  }, [clubs, userMembershipsQuery.data]);
  
  const handleExplorePress = () => {
    router.push("/explore");
  };
  
  const sections = useMemo(() => {
    const sectionData = [];
    
    if (user?.role === 'student' && joinedClubs.length > 0) {
      sectionData.push({
        title: 'My Clubs',
        data: joinedClubs,
        icon: <Users size={20} color={Colors.secondary} />
      });
    }
    
    if (favoriteClubs.length > 0) {
      sectionData.push({
        title: 'Favorites',
        data: favoriteClubs,
        icon: <Heart size={20} color={Colors.primary} />
      });
    }
    
    return sectionData;
  }, [favoriteClubs, joinedClubs, user?.role]);
  
  const renderEmptyState = () => {
    const hasJoinedClubs = user?.role === 'student' && joinedClubs.length > 0;
    const hasFavorites = favoriteClubs.length > 0;
    
    if (hasJoinedClubs || hasFavorites) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          title={user?.role === 'student' ? "No clubs yet" : "No favorite clubs yet"}
          message={
            user?.role === 'student' 
              ? "Join clubs to get updates and mark favorites for quick access."
              : "Tap the heart icon on any club to add it to your favorites for quick access."
          }
          icon={<Heart size={48} color={Colors.textSecondary} />}
        />
        <Pressable style={styles.exploreButton} onPress={handleExplorePress}>
          <Search size={20} color="white" />
          <Text style={styles.exploreButtonText}>Explore Clubs</Text>
        </Pressable>
      </View>
    );
  };
  
  const renderSectionHeader = ({ section }: { section: { title: string; icon: React.ReactNode } }) => (
    <View style={styles.sectionHeader}>
      {section.icon}
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );
  
  const renderClubItem = ({ item }: { item: Club }) => (
    <ClubCard club={item} />
  );
  
  if (clubsQuery.isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {sections.length > 0 ? (
        <SectionList
          style={styles.container}
          contentContainerStyle={styles.content}
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderClubItem}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <View style={[styles.content, styles.emptyContent]}>
          {renderEmptyState()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});