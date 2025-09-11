import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import { AuthProvider } from '@/store/auth';
import AuthGuard from '@/components/AuthGuard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { trpc, trpcClient } from '@/lib/trpc';


export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    console.log('[RootLayout] Mounted');
    return () => {
      console.log('[RootLayout] Unmounted');
    };
  }, []);

  console.log('[RootLayout] Rendering');

  return (
    <>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthGuard>
            <RootLayoutNav />
          </AuthGuard>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

function RootLayoutNav() {
  console.log('[RootLayoutNav] Rendering');
  return (
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

      </Stack>
  );
}

