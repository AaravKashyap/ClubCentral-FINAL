import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/auth';
import Colors from '@/constants/colors';
import { UserRole } from '@/types/user';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [clubName, setClubName] = useState('');
  
  const { login, signup, isLoading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin && selectedRole === 'admin' && !clubName.trim()) {
      Alert.alert('Error', 'Please enter your club name for verification');
      return;
    }

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({
          email,
          password,
          name,
          role: selectedRole,
          clubName: selectedRole === 'admin' ? clubName : undefined,
        });
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const roleDescriptions = {
    student: 'Browse and favorite clubs',
    admin: 'Club presidents - manage your club information',
    super_admin: 'Owner/leadership advisor - full access to all clubs',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Club Central</Text>
          <Text style={styles.subtitle}>
            Discover and connect with all campus clubs
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isLogin && styles.activeToggle]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {!isLogin && (
            <>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <View style={styles.roleSection}>
                <Text style={styles.roleTitle}>Account Type</Text>
                {(['student', 'admin'] as UserRole[]).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      selectedRole === role && styles.selectedRole,
                    ]}
                    onPress={() => setSelectedRole(role)}
                  >
                    <View style={styles.roleHeader}>
                      <Text style={[
                        styles.roleLabel,
                        selectedRole === role && styles.selectedRoleText,
                      ]}>
                        {role === 'student' ? 'Student' : 'Club President'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.roleDescription,
                      selectedRole === role && styles.selectedRoleDescription,
                    ]}>
                      {roleDescriptions[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedRole === 'admin' && (
                <>
                  <Text style={styles.inputLabel}>Club Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your club name for verification"
                    value={clubName}
                    onChangeText={setClubName}
                    autoCapitalize="words"
                  />
                </>
              )}
            </>
          )}

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.authButton, isLoading && styles.disabledButton]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            <Text style={styles.authButtonText}>
              {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {!isLogin && selectedRole === 'admin' && (
            <Text style={styles.approvalNote}>
              Note: Admin accounts require approval from a super admin before you can access the app.
            </Text>
          )}
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeToggleText: {
    color: 'white',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleSection: {
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  roleOption: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedRole: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedRoleText: {
    color: Colors.primary,
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedRoleDescription: {
    color: Colors.text,
  },
  authButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  approvalNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});