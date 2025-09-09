import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useAuth } from '@/store/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  id: string;
  type: string;
  userId: string;
  userName: string;
  userEmail: string;
  clubId?: string;
  clubName?: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const { user, approveAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (user?.role !== 'super_admin') return;
    
    try {
      const notificationsData = await AsyncStorage.getItem('admin_notifications');
      if (notificationsData) {
        const allNotifications = JSON.parse(notificationsData);
        // Filter out already processed notifications
        const pendingNotifications = allNotifications.filter((n: Notification) => !n.read);
        setNotifications(pendingNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  const handleApproveAdmin = async (notification: Notification) => {
    Alert.alert(
      'Approve Admin',
      `Are you sure you want to approve ${notification.userName} as an admin for ${notification.clubName || 'their club'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setIsApproving(true);
            try {
              await approveAdmin(notification.userId);
              
              // Mark notification as read
              const notificationsData = await AsyncStorage.getItem('admin_notifications');
              if (notificationsData) {
                const allNotifications = JSON.parse(notificationsData);
                const updatedNotifications = allNotifications.map((n: Notification) => 
                  n.id === notification.id ? { ...n, read: true } : n
                );
                await AsyncStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
              }
              
              Alert.alert('Success', 'Admin approved successfully!');
              await loadNotifications();
            } catch (error) {
              Alert.alert('Error', 'Failed to approve admin');
            } finally {
              setIsApproving(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const renderNotification = (notification: Notification) => (
    <View key={notification.id} style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={20} color={Colors.primary} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>New Admin Request</Text>
          <Text style={styles.notificationSubtitle}>
            {notification.userName} wants to become an admin
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{formatDate(notification.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.notificationDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{notification.userEmail}</Text>
        </View>
        {notification.clubName && (
          <View style={styles.detailRow}>
            <Ionicons name="business" size={16} color={Colors.textSecondary} />
            <Text style={styles.detailLabel}>Club:</Text>
            <Text style={styles.detailText}>{notification.clubName}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApproveAdmin(notification)}
          disabled={isApproving}
        >
          <Ionicons name="checkmark" size={16} color={Colors.white} />
          <Text style={styles.approveButtonText}>
            {isApproving ? 'Approving...' : 'Approve'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (user?.role !== 'super_admin') {
    return (
      <View style={styles.container}>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Access Restricted</Text>
          <Text style={styles.emptySubtext}>
            Only super admins can view notifications
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Review and approve admin requests
          </Text>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              All admin requests have been processed
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map(renderNotification)}
          </View>
        )}
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  notificationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  approveButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 4,
  },
});