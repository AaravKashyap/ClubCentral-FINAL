import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Smartphone, Wifi, WifiOff } from 'lucide-react-native';
import { usePWA } from '@/hooks/usePWA';

export function PWAStatus() {
  const { isInstalled, isOnline, isSupported } = usePWA();

  if (!isSupported) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusItem}>
        <Smartphone size={16} color={isInstalled ? '#10b981' : '#6b7280'} />
        <Text style={[styles.statusText, isInstalled && styles.activeText]}>
          {isInstalled ? 'Installed' : 'Web App'}
        </Text>
      </View>
      
      <View style={styles.statusItem}>
        {isOnline ? (
          <Wifi size={16} color="#10b981" />
        ) : (
          <WifiOff size={16} color="#ef4444" />
        )}
        <Text style={[styles.statusText, isOnline && styles.activeText]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeText: {
    color: '#10b981',
  },
});