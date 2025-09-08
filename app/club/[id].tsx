import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Linking, Alert, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Heart, Mail, Instagram, Globe, Users, Calendar, MapPin, Clock, Info, ImageIcon, Camera, Save, X, Trash2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useFavoritesStore } from "@/store/favorites";
import MeetingItem from "@/components/MeetingItem";
import { clubs } from "@/mocks/clubs";
import { useAuth } from "@/store/auth";

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [isJoining, setIsJoining] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const club = clubs.find(c => c.id === id);
  
  // Mock membership status - in real app this would come from user data
  const isMember = user?.role === 'student' && ['1', '3', '7'].includes(id || '');
  
  // Mock member count - in real app this would come from server
  const memberCount = club?.memberCount || 0;
  
  const [isLeaving, setIsLeaving] = useState(false);
  
  const [isUpdating, setIsUpdating] = useState(false);
  

  

  
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
    Linking.openURL(`mailto:${club.presidentEmail}`);
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
  
  const handleJoinLeavePress = async () => {
    if (!id) return;
    
    if (isMember) {
      setIsLeaving(true);
      // Simulate API call
      setTimeout(() => {
        setIsLeaving(false);
        Alert.alert('Success', 'You have left the club.');
      }, 1000);
    } else {
      setIsJoining(true);
      // Simulate API call
      setTimeout(() => {
        setIsJoining(false);
        Alert.alert('Success', 'You have successfully joined the club!');
      }, 1000);
    }
  };
  
  const handleUpdateImage = async () => {
    if (!id || !newImageUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid image URL');
      return;
    }
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert('Success', 'Club image updated successfully!');
      setIsEditingImage(false);
      setNewImageUrl('');
    }, 1000);
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
          onPress: async () => {
            setIsUpdating(true);
            // Simulate API call
            setTimeout(() => {
              setIsUpdating(false);
              Alert.alert('Success', 'Club image removed successfully!');
            }, 1000);
          }
        }
      ]
    );
  };
  
  const canEditClub = user?.role === 'admin' || user?.role === 'super_admin';
  const isClubAdmin = canEditClub && user?.email === club.presidentEmail;
  
  const handleCancelMeeting = (meetingId: string) => {
    if (!isClubAdmin) return;
    
    Alert.alert(
      'Cancel Meeting',
      'Are you sure you want to cancel this meeting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            // In real app, this would update the meeting in the database
            const meeting = club.upcomingMeetings.find(m => m.id === meetingId);
            if (meeting) {
              meeting.cancelled = true;
              Alert.alert('Success', 'Meeting cancelled successfully');
            }
          }
        }
      ]
    );
  };
  

  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
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
              style={[styles.editImageButton, styles.editCancelButton]}
              onPress={() => {
                setIsEditingImage(false);
                setNewImageUrl('');
              }}
            >
              <X size={16} color={Colors.textSecondary} />
              <Text style={styles.editCancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.editImageButton, styles.saveButton]}
              onPress={handleUpdateImage}
              disabled={isUpdating}
            >
              <Save size={16} color="white" />
              <Text style={styles.saveButtonText}>
                {isUpdating ? 'Saving...' : 'Save'}
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
                isMember ? styles.leaveButton : styles.joinButtonActive,
                (isJoining || isLeaving) && styles.disabledButton
              ]}
              onPress={handleJoinLeavePress}
              disabled={isJoining || isLeaving}
            >
              <Users size={20} color="white" />
              <Text style={styles.joinText}>
                {(isJoining || isLeaving) ? 'Loading...' : isMember ? 'Leave Club' : 'Join Club'}
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
            {memberCount} members
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
          <Text style={styles.infoText}>{club.meetingFrequency} on {club.meetingDay}s</Text>
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
        {club.upcomingMeetings.filter(m => !m.cancelled).length > 0 ? (
          club.upcomingMeetings.filter(m => !m.cancelled).map((meeting, index) => (
            <View key={meeting.id || index} style={styles.meetingContainer}>
              <MeetingItem 
                club={club}
                meeting={meeting}
              />
              {isClubAdmin && (
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => handleCancelMeeting(meeting.id)}
                >
                  <Trash2 size={16} color={Colors.error} />
                  <Text style={styles.cancelButtonText}>Cancel Meeting</Text>
                </Pressable>
              )}
            </View>
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
            <Text style={styles.contactText}>Email President</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
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
  editCancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border || Colors.textSecondary + '40',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  editCancelButtonText: {
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
  meetingContainer: {
    marginBottom: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '20',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
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