import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/store/auth';
import Colors from '@/constants/colors';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('[AuthGuard] State:', { isLoading, isAuthenticated, segments });
    
    if (isLoading) {
      console.log('[AuthGuard] Still loading, skipping navigation');
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    console.log('[AuthGuard] inAuthGroup:', inAuthGroup);

    if (!isAuthenticated && !inAuthGroup) {
      console.log('[AuthGuard] Not authenticated, redirecting to /auth');
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[AuthGuard] Authenticated but on auth page, redirecting to /(tabs)');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    console.log('[AuthGuard] Rendering loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  console.log('[AuthGuard] Rendering children');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});