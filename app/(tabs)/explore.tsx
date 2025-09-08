import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";

import Colors from "@/constants/colors";
import { ClubCategory, Club } from "@/types/club";
import ClubCard from "@/components/ClubCard";
import CategoryPills from "@/components/CategoryPills";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { trpc } from "@/lib/trpc";

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || "");
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory | null>(null);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  
  const clubsQuery = trpc.clubs.getAll.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const clubs = useMemo(() => clubsQuery.data || [], [clubsQuery.data]);
  
  useEffect(() => {
    // Filter clubs based on search query and selected category
    let filtered = clubs;
    
    if (searchQuery) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        club.presidentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.advisorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(club => club.category === selectedCategory);
    }
    
    setFilteredClubs(filtered);
  }, [searchQuery, selectedCategory, clubs]);
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Explore Clubs</Text>
        <Text style={styles.subtitle}>
          {filteredClubs.length} of {clubs.length} clubs
        </Text>
      </View>
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name, description, tags, or people..."
      />
      <CategoryPills 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </View>
  );
  
  const renderEmptyState = () => {
    if (clubsQuery.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading clubs...</Text>
        </View>
      );
    }
    
    if (clubsQuery.error) {
      return (
        <EmptyState
          title="Failed to load clubs"
          message="Please check your connection and try again."
          icon={<Search size={40} color={Colors.textSecondary} />}
        />
      );
    }
    
    const isFiltered = searchQuery || selectedCategory;
    return (
      <EmptyState
        title={isFiltered ? "No clubs found" : "No clubs available"}
        message={
          isFiltered 
            ? "Try adjusting your search or filters to find what you are looking for."
            : "There are no clubs available at this time."
        }
        icon={<Search size={40} color={Colors.textSecondary} />}
      />
    );
  };
  
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        filteredClubs.length === 0 && styles.emptyContent
      ]}
      data={filteredClubs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ClubCard club={item} />}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyState}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    marginHorizontal: -16,
  },
  headerTop: {
    paddingHorizontal: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});