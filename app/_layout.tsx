import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { AuthProvider } from '@/store/auth';
import AuthGuard from '@/components/AuthGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { httpLink } from '@trpc/client';
import superjson from 'superjson';



export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({
    links: [
      httpLink({
        url: process.env.EXPO_PUBLIC_RORK_API_BASE_URL ? 
          `${process.env.EXPO_PUBLIC_RORK_API_BASE_URL}/api/trpc` : 
          `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081'}/api/trpc`,
        transformer: superjson,
      }),
    ],
  }));
  
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthGuard>
            <RootLayoutNav />
          </AuthGuard>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen 
          name="club/[id]" 
          options={{ 
            title: "Club Details",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="backend-test" 
          options={{ 
            title: "Backend Test",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="debug" 
          options={{ 
            title: "Debug",
            headerBackTitle: "Back",
          }} 
        />
      </Stack>
    </>
  );
}