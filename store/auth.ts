import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, LoginCredentials, SignupData } from '@/types/user';

const STORAGE_KEY = 'club_central_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const initializeApp = useCallback(async () => {
    try {
      console.log('Initializing app...');
      await createDefaultUsers();
      await loadUser();
      await loadTotalUsers();
      console.log('App initialization complete');
    } catch (error) {
      console.error('App initialization error:', error);
      setIsLoading(false);
    }
  }, []);

  // Load user from storage on app start
  useEffect(() => {
    initializeApp();
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('App initialization timeout, setting loading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeout);
  }, [initializeApp, isLoading]);

  const createDefaultUsers = async () => {
    try {
      console.log('Checking for existing users...');
      const usersData = await AsyncStorage.getItem('all_users');
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
        
        await AsyncStorage.setItem('all_users', JSON.stringify(defaultUsers));
        console.log('Default users created successfully');
      } else {
        console.log('Users already exist in storage');
      }
    } catch (error) {
      console.error('Error creating default users:', error);
      throw error;
    }
  };

  const loadUser = async () => {
    try {
      console.log('Loading user from storage...');
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('User loaded:', parsedUser.email);
        setUser(parsedUser);
      } else {
        console.log('No user found in storage');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
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