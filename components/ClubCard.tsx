import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Heart, ImageIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Club } from "@/types/club";
import { useFavoritesStore } from "@/store/favorites";
import Colors from "@/constants/colors";

type ClubCardProps = {
  club: Club;
  compact?: boolean;
};

export default function ClubCard({ club, compact = false }: ClubCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFavorited = isFavorite(club.id);

  const handlePress = () => {
    router.push(`/club/${club.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(club.id);
  };

  if (compact) {
    return (
      <Pressable 
        style={styles.compactContainer} 
        onPress={handlePress}
      >
        {club.imageUrl && club.imageUrl.trim() !== '' && club.imageUrl !== 'undefined' ? (
          <Image 
            source={{ uri: club.imageUrl }}
            style={styles.compactImage}
            contentFit="cover"
            onError={() => console.log('Image failed to load:', club.imageUrl)}
          />
        ) : (
          <View style={[styles.compactImage, styles.placeholderImage]}>
            <ImageIcon size={24} color={Colors.textSecondary} />
          </View>
        )}
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{club.name}</Text>
          <Text style={styles.compactCategory}>{club.category}</Text>
        </View>
        <Pressable 
          style={styles.favoriteButton} 
          onPress={handleFavoritePress}
          hitSlop={10}
        >
          <Heart 
            size={18} 
            color={isFavorited ? Colors.error : Colors.textSecondary}
            fill={isFavorited ? Colors.error : "none"}
          />
        </Pressable>
      </Pressable>
    );
  }

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
    >
      {club.imageUrl && club.imageUrl.trim() !== '' && club.imageUrl !== 'undefined' ? (
        <Image 
          source={{ uri: club.imageUrl }}
          style={styles.image}
          contentFit="cover"
          onError={() => console.log('Image failed to load:', club.imageUrl)}
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <ImageIcon size={48} color={Colors.textSecondary} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{club.name}</Text>
          <Pressable 
            style={styles.favoriteButton} 
            onPress={handleFavoritePress}
            hitSlop={10}
          >
            <Heart 
              size={22} 
              color={isFavorited ? Colors.error : Colors.textSecondary}
              fill={isFavorited ? Colors.error : "none"}
            />
          </Pressable>
        </View>
        <Text style={styles.category}>{club.category}</Text>
        <Text style={styles.description} numberOfLines={2}>{club.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.meetingInfo}>
            {club.meetingFrequency}{club.meetingDay ? ` • ${club.meetingDay}s` : ""}
          </Text>
          <Text style={styles.memberCount}>{club.memberCount} members</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 140,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  meetingInfo: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  memberCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  favoriteButton: {
    padding: 4,
  },
  // Compact styles
  compactContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border || Colors.textSecondary + '20',
  },
  compactContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  compactCategory: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
  },
});