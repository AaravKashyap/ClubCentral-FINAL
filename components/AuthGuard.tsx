import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/store/auth';
import Colors from '@/constants/colors';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    console.log('[AuthGuard] State:', { isLoading, isAuthenticated, segments, navReady: !!navigationState?.key });

    if (isLoading) {
      console.log('[AuthGuard] Still loading, skipping navigation');
      return;
    }

    if (!navigationState?.key) {
      console.log('[AuthGuard] Navigation not ready yet, skipping navigation');
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    console.log('[AuthGuard] inAuthGroup:', inAuthGroup);

    try {
      if (!isAuthenticated && !inAuthGroup) {
        console.log('[AuthGuard] Not authenticated, redirecting to /auth');
        router.replace('/auth');
      } else if (isAuthenticated && inAuthGroup) {
        console.log('[AuthGuard] Authenticated but on auth page, redirecting to /(tabs)');
        router.replace('/(tabs)');
      }
    } catch (e) {
      console.log('[AuthGuard] Navigation error:', e);
    }
  }, [isAuthenticated, isLoading, segments, router, navigationState?.key]);

  if (isLoading || !navigationState?.key) {
    console.log('[AuthGuard] Rendering loading screen');
    return (
      <View style={styles.loadingContainer} testID="authguard-loading">
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