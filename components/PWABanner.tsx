import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Download, X, WifiOff } from 'lucide-react-native';
import { usePWA } from '@/hooks/usePWA';

export function PWABanner() {
  const { isInstallable, isOnline, installApp, isSupported } = usePWA();
  const [showBanner, setShowBanner] = React.useState(true);

  if (!isSupported || !showBanner) {
    return null;
  }

  if (!isOnline) {
    return (
      <View style={[styles.banner, styles.offlineBanner]}>
        <WifiOff size={20} color="#ef4444" />
        <Text style={[styles.bannerText, styles.offlineText]}>
          You&apos;re offline. Some features may not work.
        </Text>
      </View>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        <Download size={20} color="#3b82f6" />
        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>Install App</Text>
          <Text style={styles.bannerSubtitle}>
            Add Campus Club Finder to your home screen for quick access
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.installButton}
          onPress={installApp}
          testID="pwa-install-button"
        >
          <Text style={styles.installButtonText}>Install</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowBanner(false)}
          testID="pwa-close-button"
        >
          <X size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  offlineBanner: {
    backgroundColor: '#fef2f2',
    borderBottomColor: '#fecaca',
    justifyContent: 'center',
    gap: 8,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  bannerText: {
    fontSize: 14,
    color: '#111827',
  },
  offlineText: {
    color: '#dc2626',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  installButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  installButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
});