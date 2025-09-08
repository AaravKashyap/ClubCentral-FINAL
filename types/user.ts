export type UserRole = 'student' | 'admin' | 'super_admin';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clubId?: string; // For admin users, the club they manage
  clubName?: string; // For admin users, the name of their club
  isApproved: boolean; // For admin users, whether they're approved by super admin
  createdAt: string;
  password?: string; // For super admin authentication
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupData = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  clubId?: string;
  clubName?: string;
};