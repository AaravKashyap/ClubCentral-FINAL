import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/store/auth';
import { User } from '@/types/user';
import Colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AdminManagementScreen() {
  const { user, approveAdmin, getPendingAdmins, getAllUsers } = useAuth();
  const [pendingAdmins, setPendingAdmins] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pending, users] = await Promise.all([
        getPendingAdmins(),
        getAllUsers(),
      ]);
      setPendingAdmins(pending);
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleApproveAdmin = async (userId: string) => {
    Alert.alert(
      'Approve Admin',
      'Are you sure you want to approve this admin account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            setLoading(true);
            try {
              await approveAdmin(userId);
              await loadData();
              Alert.alert('Success', 'Admin account approved successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to approve admin account');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (user?.role !== 'super_admin') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Access Denied' }} />
        <View style={styles.accessDenied}>
          <Ionicons name="close-circle" size={48} color={Colors.error} />
          <Text style={styles.accessDeniedText}>
            You don't have permission to access this page
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Admin Management' }} />
      
      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{allUsers.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color={Colors.warning} />
          <Text style={styles.statNumber}>{pendingAdmins.length}</Text>
          <Text style={styles.statLabel}>Pending Approvals</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text style={styles.statNumber}>
            {allUsers.filter(u => u.role === 'admin' && u.isApproved).length}
          </Text>
          <Text style={styles.statLabel}>Approved Admins</Text>
        </View>
      </View>

      {/* Pending Approvals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Admin Approvals</Text>
        {pendingAdmins.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
            <Text style={styles.emptyStateText}>No pending approvals</Text>
          </View>
        ) : (
          pendingAdmins.map((admin) => (
            <View key={admin.id} style={styles.adminCard}>
              <View style={styles.adminInfo}>
                <Text style={styles.adminName}>{admin.name}</Text>
                <Text style={styles.adminEmail}>{admin.email}</Text>
                <Text style={styles.adminClub}>Club: {admin.clubId || 'Not specified'}</Text>
                <Text style={styles.adminDate}>
                  Applied: {new Date(admin.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.approveButton, loading && styles.disabledButton]}
                onPress={() => handleApproveAdmin(admin.id)}
                disabled={loading}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* All Users */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Users</Text>
        {allUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userMeta}>
                <Text style={[
                  styles.userRole,
                  user.role === 'super_admin' && styles.superAdminRole,
                  user.role === 'admin' && styles.adminRole,
                ]}>
                  {user.role === 'super_admin' ? 'Super Admin' : 
                   user.role === 'admin' ? 'Club President' : 'Student'}
                </Text>
                {user.role === 'admin' && (
                  <Text style={[
                    styles.approvalStatus,
                    user.isApproved ? styles.approved : styles.pending,
                  ]}>
                    {user.isApproved ? 'Approved' : 'Pending'}
                  </Text>
                )}
              </View>
            </View>
          </View>
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
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  accessDeniedText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  adminCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  adminClub: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
  },
  adminDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  approveButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  approveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.border,
    color: Colors.textSecondary,
  },
  superAdminRole: {
    backgroundColor: Colors.error + '20',
    color: Colors.error,
  },
  adminRole: {
    backgroundColor: Colors.primary + '20',
    color: Colors.primary,
  },
  approvalStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  approved: {
    backgroundColor: Colors.success + '20',
    color: Colors.success,
  },
  pending: {
    backgroundColor: Colors.warning + '20',
    color: Colors.warning,
  },
});