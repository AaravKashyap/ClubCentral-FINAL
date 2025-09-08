import React, { memo } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import Colors from "@/constants/colors";
import { ClubCategory } from "@/types/club";
// Categories based on the real club data
const categories: ClubCategory[] = [
  "Academic",
  "Arts", 
  "Business",
  "Community Service",
  "Cultural",
  "Hobbies",
  "Sports",
  "STEM"
];

type CategoryPillsProps = {
  selectedCategory: ClubCategory | null;
  onSelectCategory: (category: ClubCategory | null) => void;
};

const CategoryPills = memo(function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          style={[
            styles.pill, 
            selectedCategory === null && styles.selectedPill
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text 
            style={[
              styles.pillText, 
              selectedCategory === null && styles.selectedPillText
            ]}
          >
            All Categories
          </Text>
        </Pressable>
        
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.pill, 
              selectedCategory === category && styles.selectedPill
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text 
              style={[
                styles.pillText, 
                selectedCategory === category && styles.selectedPillText
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

export default CategoryPills;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedPill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  selectedPillText: {
    color: "white",
    fontWeight: "600",
  },
});