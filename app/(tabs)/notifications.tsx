import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { Check, Clock, User, Mail } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';
import { AdminNotification } from '@/types/club';

export default function NotificationsScreen() {
  const notificationsQuery = trpc.notifications.getAll.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const approveAdminMutation = trpc.notifications.approveAdmin.useMutation();

  const handleApproveAdmin = async (notification: AdminNotification) => {
    Alert.alert(
      'Approve Admin',
      `Are you sure you want to approve ${notification.userName} as an admin for ${notification.clubName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              await approveAdminMutation.mutateAsync({
                userId: notification.userId,
                notificationId: notification.id,
              });
              Alert.alert('Success', 'Admin approved successfully!');
              notificationsQuery.refetch();
            } catch (error) {
              Alert.alert('Error', 'Failed to approve admin. Please try again.');
              console.error('Error approving admin:', error);
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

  const renderNotification = (notification: AdminNotification) => (
    <View key={notification.id} style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <User size={20} color={Colors.primary} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>New Admin Request</Text>
          <Text style={styles.notificationSubtitle}>
            {notification.userName} wants to become an admin
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>{formatDate(notification.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.notificationDetails}>
        <View style={styles.detailRow}>
          <Mail size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{notification.userEmail}</Text>
        </View>
        {notification.clubName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Club:</Text>
            <Text style={styles.detailText}>{notification.clubName}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApproveAdmin(notification)}
          disabled={approveAdminMutation.isPending}
        >
          <Check size={16} color={Colors.white} />
          <Text style={styles.approveButtonText}>
            {approveAdminMutation.isPending ? 'Approving...' : 'Approve'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (notificationsQuery.isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  if (notificationsQuery.error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load notifications</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => notificationsQuery.refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const notifications = notificationsQuery.data || [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={notificationsQuery.isRefetching}
            onRefresh={() => notificationsQuery.refetch()}
            tintColor={Colors.primary}
          />
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