import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function DebugScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Debug' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Debug Screen</Text>
        <Text style={styles.text}>If you can see this, the basic app is working!</Text>
        <Text style={styles.text}>React Native version: {require('react-native/package.json').version}</Text>
        <Text style={styles.text}>Expo version: {require('expo/package.json').version}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});