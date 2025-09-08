import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Linking, Alert, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Heart, Mail, Instagram, Globe, Users, Calendar, MapPin, Clock, Info, ImageIcon, Camera, Save, X } from "lucide-react-native";

import Colors from "@/constants/colors";
import { useFavoritesStore } from "@/store/favorites";
import MeetingItem from "@/components/MeetingItem";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/store/auth";

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const clubsQuery = trpc.clubs.getAll.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const clubs = clubsQuery.data || [];
  const club = clubs.find(c => c.id === id);
  
  // Check if user is a member of this club
  const isMemberQuery = trpc.clubs.isUserMember.useQuery(
    { clubId: id || '' },
    { enabled: !!id && user?.role === 'student', retry: false }
  );
  
  // Get club member count
  const clubMembersQuery = trpc.clubs.getClubMembers.useQuery(
    { clubId: id || '' },
    { enabled: !!id, retry: false }
  );
  
  const joinClubMutation = trpc.clubs.join.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'You have successfully joined the club!');
      isMemberQuery.refetch();
      clubMembersQuery.refetch();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to join club');
    },
    onSettled: () => {
      setIsJoining(false);
    }
  });
  
  const leaveClubMutation = trpc.clubs.leave.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'You have left the club.');
      isMemberQuery.refetch();
      clubMembersQuery.refetch();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to leave club');
    }
  });
  
  const updateClubMutation = trpc.clubs.update.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Club image updated successfully!');
      setIsEditingImage(false);
      setNewImageUrl('');
      clubsQuery.refetch();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to update club image');
    }
  });
  
  if (clubsQuery.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }
  
  if (!club) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Club not found</Text>
      </View>
    );
  }
  
  const isFavorited = isFavorite(club.id);
  
  const handleFavoritePress = () => {
    toggleFavorite(club.id);
  };
  
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${club.email}`);
  };
  
  const handleInstagramPress = () => {
    if (club.socialMedia?.instagram) {
      Linking.openURL(`https://instagram.com/${club.socialMedia.instagram.replace("@", "")}`);
    }
  };
  
  const handleWebsitePress = () => {
    if (club.socialMedia?.website) {
      Linking.openURL(`https://${club.socialMedia.website}`);
    }
  };
  
  const handleJoinLeavePress = () => {
    if (!id) return;
    
    setIsJoining(true);
    
    if (isMemberQuery.data) {
      // User is already a member, so leave the club
      leaveClubMutation.mutate({ clubId: id });
    } else {
      // User is not a member, so join the club
      joinClubMutation.mutate({ clubId: id });
    }
  };
  
  const handleUpdateImage = () => {
    if (!id || !newImageUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid image URL');
      return;
    }
    
    updateClubMutation.mutate({
      clubId: id,
      updates: {
        imageUrl: newImageUrl.trim()
      }
    });
  };
  
  const handleRemoveImage = () => {
    if (!id) return;
    
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove the club image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            updateClubMutation.mutate({
              clubId: id,
              updates: {
                imageUrl: null
              }
            });
          }
        }
      ]
    );
  };
  
  const canEditClub = user?.role === 'admin' || user?.role === 'super_admin';
  

  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        {club.imageUrl ? (
          <Image 
            source={{ uri: club.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <ImageIcon size={64} color={Colors.textSecondary} />
            <Text style={styles.placeholderText}>No image uploaded</Text>
          </View>
        )}
        
        {canEditClub && (
          <View style={styles.imageActions}>
            <Pressable 
              style={styles.imageActionButton}
              onPress={() => setIsEditingImage(true)}
            >
              <Camera size={20} color="white" />
            </Pressable>
            {club.imageUrl && (
              <Pressable 
                style={[styles.imageActionButton, styles.removeButton]}
                onPress={handleRemoveImage}
              >
                <X size={20} color="white" />
              </Pressable>
            )}
          </View>
        )}
      </View>
      
      {isEditingImage && (
        <View style={styles.editImageContainer}>
          <Text style={styles.editImageTitle}>Update Club Image</Text>
          <TextInput
            style={styles.imageUrlInput}
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            value={newImageUrl}
            onChangeText={setNewImageUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.editImageActions}>
            <Pressable 
              style={[styles.editImageButton, styles.cancelButton]}
              onPress={() => {
                setIsEditingImage(false);
                setNewImageUrl('');
              }}
            >
              <X size={16} color={Colors.textSecondary} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.editImageButton, styles.saveButton]}
              onPress={handleUpdateImage}
              disabled={updateClubMutation.isPending}
            >
              <Save size={16} color="white" />
              <Text style={styles.saveButtonText}>
                {updateClubMutation.isPending ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{club.name}</Text>
          <Text style={styles.category}>{club.category}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.favoriteButton, isFavorited && styles.favoriteButtonActive]} 
            onPress={handleFavoritePress}
          >
            <Heart 
              size={20} 
              color={isFavorited ? "white" : Colors.primary}
              fill={isFavorited ? "white" : "none"}
            />
            <Text style={[styles.favoriteText, isFavorited && styles.favoriteTextActive]}>
              {isFavorited ? "Favorited" : "Favorite"}
            </Text>
          </Pressable>
          
          {user?.role === 'student' && (
            <Pressable 
              style={[
                styles.joinButton, 
                isMemberQuery.data ? styles.leaveButton : styles.joinButtonActive,
                isJoining && styles.disabledButton
              ]}
              onPress={handleJoinLeavePress}
              disabled={isJoining || isMemberQuery.isLoading}
            >
              <Users size={20} color="white" />
              <Text style={styles.joinText}>
                {isJoining ? 'Loading...' : isMemberQuery.data ? 'Leave Club' : 'Join Club'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      
      <Text style={styles.description}>{club.description}</Text>
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Users size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            {clubMembersQuery.data?.memberCount || 0} members
          </Text>
        </View>
        
        {club.yearFounded > 0 && (
          <View style={styles.infoRow}>
            <Calendar size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Founded in {club.yearFounded}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Clock size={18} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{club.meetingDay} at {club.meetingTime}</Text>
        </View>
        
        {club.meetingLocation && (
          <View style={styles.infoRow}>
            <MapPin size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{club.meetingLocation}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leadership</Text>
        <View style={styles.leadershipContainer}>
          <View style={styles.leadershipItem}>
            <Text style={styles.leadershipRole}>President</Text>
            <Text style={styles.leadershipName}>{club.presidentName}</Text>
          </View>
          <View style={styles.leadershipItem}>
            <Text style={styles.leadershipRole}>Advisor</Text>
            <Text style={styles.leadershipName}>{club.advisorName}</Text>
          </View>
        </View>
      </View>
      
      {club.requirements && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsContainer}>
            <Info size={18} color={Colors.textSecondary} style={styles.requirementsIcon} />
            <Text style={styles.requirementsText}>{club.requirements}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
        {club.upcomingMeetings.length > 0 ? (
          club.upcomingMeetings.map((meeting, index) => (
            <MeetingItem 
              key={index}
              club={club}
              meeting={meeting}
            />
          ))
        ) : (
          <Text style={styles.noMeetingsText}>No upcoming meetings scheduled</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.contactContainer}>
          <Pressable style={styles.contactButton} onPress={handleEmailPress}>
            <Mail size={20} color={Colors.primary} />
            <Text style={styles.contactText}>Email</Text>
          </Pressable>
          
          {club.socialMedia?.instagram && (
            <Pressable style={styles.contactButton} onPress={handleInstagramPress}>
              <Instagram size={20} color={Colors.primary} />
              <Text style={styles.contactText}>Instagram</Text>
            </Pressable>
          )}
          
          {club.socialMedia?.website && (
            <Pressable style={styles.contactButton} onPress={handleWebsitePress}>
              <Globe size={20} color={Colors.primary} />
              <Text style={styles.contactText}>Website</Text>
            </Pressable>
          )}
        </View>
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
    paddingBottom: 32,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: "100%",
    height: 200,
  },
  placeholderImage: {
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || Colors.textSecondary + '20',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  imageActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  imageActionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
  },
  editImageContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || Colors.textSecondary + '20',
  },
  editImageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  imageUrlInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border || Colors.textSecondary + '40',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  editImageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editImageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border || Colors.textSecondary + '40',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: Colors.primary,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  favoriteButtonActive: {
    backgroundColor: Colors.primary,
  },
  favoriteText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
  },
  favoriteTextActive: {
    color: "white",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonActive: {
    backgroundColor: Colors.secondary,
  },
  leaveButton: {
    backgroundColor: Colors.error || '#ff4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  joinText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  infoSection: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  leadershipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leadershipItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  leadershipRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  leadershipName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  requirementsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  requirementsIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  requirementsText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
  },
  contactContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    margin: 4,
    minWidth: 100,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 15,
    color: Colors.text,
  },
  noMeetingsText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: "center",
    marginTop: 40,
  },
});