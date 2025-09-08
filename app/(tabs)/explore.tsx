import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";

import Colors from "@/constants/colors";
import { ClubCategory, Club } from "@/types/club";
import ClubCard from "@/components/ClubCard";
import CategoryPills from "@/components/CategoryPills";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { clubs as mockClubs } from "@/mocks/clubs";

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || "");
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory | null>(null);
  
  const clubs = useMemo(() => {
    console.log('Explore screen - clubs loaded:', mockClubs.length);
    return mockClubs;
  }, []);
  
  const filteredClubs = useMemo(() => {
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
    
    return filtered;
  }, [searchQuery, selectedCategory, clubs]);
  
  const renderHeader = useCallback(() => (
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
  ), [filteredClubs.length, clubs.length, searchQuery, selectedCategory]);
  
  const renderEmptyState = useCallback(() => {
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
  }, [searchQuery, selectedCategory]);
  
  const renderClubCard = useCallback(({ item }: { item: Club }) => (
    <ClubCard club={item} />
  ), []);
  
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        filteredClubs.length === 0 && styles.emptyContent
      ]}
      data={filteredClubs}
      keyExtractor={(item) => item.id}
      renderItem={renderClubCard}
      getItemLayout={(data, index) => ({
        length: 120, // Approximate height of ClubCard
        offset: 120 * index,
        index,
      })}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyState}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
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