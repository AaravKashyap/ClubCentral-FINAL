import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, LoginCredentials, SignupData } from '@/types/user';

const STORAGE_KEY = 'club_central_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  // Load user from storage on app start
  useEffect(() => {
    console.log('[Auth] useEffect triggered, starting initialization');
    let mounted = true;
    
    const initializeApp = async () => {
      try {
        console.log('[Auth] Initializing app...');
        
        // Create default users if needed
        await createDefaultUsers();
        
        // Load current user
        await loadUser();
        
        // Load total users count
        await loadTotalUsers();
        
        console.log('[Auth] App initialization complete');
      } catch (error) {
        console.error('[Auth] App initialization error:', error);
      } finally {
        // Always set loading to false if component is still mounted
        if (mounted) {
          console.log('[Auth] Setting loading to false from initialization');
          setIsLoading(false);
        }
      }
    };
    
    // Start initialization
    initializeApp();
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('[Auth] App initialization timeout (1s), forcing loading to false');
        setIsLoading(false);
      }
    }, 1000); // 1 second timeout
    
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []); // Run only once on mount

  const createDefaultUsers = async () => {
    try {
      console.log('[Auth] Checking for existing users...');
      const usersData = await AsyncStorage.getItem('all_users').catch(e => {
        console.error('[Auth] AsyncStorage error:', e);
        return null;
      });
      if (!usersData) {
        console.log('Creating default users...');
        // Create default super admin users
        const defaultUsers: User[] = [
          {
            id: '1',
            email: 'kashyap3185@mydusd.org',
            name: 'Super Admin',
            role: 'super_admin',
            isApproved: true,
            createdAt: new Date().toISOString(),
            password: '6046AK2008',
          },
          {
            id: '2',
            email: 'meadipudi8772@mydusd.org',
            name: 'Asthra',
            role: 'super_admin',
            isApproved: true,
            createdAt: new Date().toISOString(),
            password: 'dhsclubs2526',
          },
          {
            id: '3',
            email: 'malmgren9480@mydusd.org',
            name: 'Olivia',
            role: 'super_admin',
            isApproved: true,
            createdAt: new Date().toISOString(),
            password: 'dhsclubs2526',
          },
          {
            id: '4',
            email: 'rosbyelise@dublinusd.org',
            name: 'Elise Rosby',
            role: 'super_admin',
            isApproved: true,
            createdAt: new Date().toISOString(),
            password: 'dhsclubs2526',
          }
        ];
        
        await AsyncStorage.setItem('all_users', JSON.stringify(defaultUsers)).catch(e => {
          console.error('[Auth] Failed to save default users:', e);
        });
        console.log('[Auth] Default users created successfully');
      } else {
        console.log('[Auth] Users already exist in storage');
      }
    } catch (error) {
      console.error('[Auth] Error creating default users:', error);
      // Don't throw, just continue
    }
  };

  const loadUser = async () => {
    try {
      console.log('[Auth] Loading user from storage...');
      const userData = await AsyncStorage.getItem(STORAGE_KEY).catch(e => {
        console.error('[Auth] AsyncStorage error:', e);
        return null;
      });
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('[Auth] User loaded:', parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log('[Auth] No user found in storage');
      }
    } catch (error) {
      console.error('[Auth] Error loading user:', error);
    }
  };

  const loadTotalUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem('all_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        setTotalUsers(users.length);
      }
    } catch (error) {
      console.error('Error loading total users:', error);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      
      // Update users list
      const usersData = await AsyncStorage.getItem('all_users');
      const users = usersData ? JSON.parse(usersData) : [];
      const existingIndex = users.findIndex((u: User) => u.id === userData.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = userData;
      } else {
        users.push(userData);
      }
      
      await AsyncStorage.setItem('all_users', JSON.stringify(users));
      setTotalUsers(users.length);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with AsyncStorage
      const usersData = await AsyncStorage.getItem('all_users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
      console.log('Login attempt with email:', credentials.email);
      
      const foundUser = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (!foundUser) {
        throw new Error(`User not found`);
      }
      
      // Check password for super admin
      if (foundUser.role === 'super_admin' && foundUser.password && foundUser.password !== credentials.password) {
        throw new Error('Invalid password');
      }
      
      // For admin users, check if they're approved
      if (foundUser.role === 'admin' && !foundUser.isApproved) {
        throw new Error('Your account is pending approval from a super admin');
      }
      
      console.log('Login successful for user:', foundUser.email);
      await saveUser(foundUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (signupData: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      const usersData = await AsyncStorage.getItem('all_users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      if (users.find(u => u.email === signupData.email)) {
        throw new Error('User already exists');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: signupData.email,
        name: signupData.name,
        role: signupData.role,
        clubId: signupData.clubId,
        clubName: signupData.clubName,
        isApproved: signupData.role === 'student',
        createdAt: new Date().toISOString(),
      };
      
      await saveUser(newUser);
      
      // If it's an admin signup, notify super admins
      if (signupData.role === 'admin') {
        await notifySuperAdmins(newUser);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const notifySuperAdmins = async (newAdmin: User) => {
    try {
      const notificationsData = await AsyncStorage.getItem('admin_notifications');
      const notifications = notificationsData ? JSON.parse(notificationsData) : [];
      
      notifications.push({
        id: Date.now().toString(),
        type: 'admin_approval',
        userId: newAdmin.id,
        userName: newAdmin.name,
        userEmail: newAdmin.email,
        clubId: newAdmin.clubId,
        clubName: newAdmin.clubName,
        createdAt: new Date().toISOString(),
        read: false,
      });
      
      await AsyncStorage.setItem('admin_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error notifying super admins:', error);
    }
  };

  const approveAdmin = useCallback(async (userId: string): Promise<void> => {
    try {
      const usersData = await AsyncStorage.getItem('all_users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        users[userIndex].isApproved = true;
        await AsyncStorage.setItem('all_users', JSON.stringify(users));
        
        // If it's the current user, update the context
        if (user?.id === userId) {
          setUser(users[userIndex]);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users[userIndex]));
        }
      }
    } catch (error) {
      console.error('Error approving admin:', error);
      throw error;
    }
  }, [user]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const getAllUsers = useCallback(async (): Promise<User[]> => {
    try {
      const usersData = await AsyncStorage.getItem('all_users');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }, []);

  const getPendingAdmins = useCallback(async () => {
    try {
      const users = await getAllUsers();
      return users.filter(u => u.role === 'admin' && !u.isApproved);
    } catch (error) {
      console.error('Error getting pending admins:', error);
      return [];
    }
  }, [getAllUsers]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    totalUsers,
    login,
    signup,
    logout,
    approveAdmin,
    getAllUsers,
    getPendingAdmins,
  }), [user, isLoading, totalUsers, login, signup, logout, approveAdmin, getAllUsers, getPendingAdmins]);
});