import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { trpc } from '@/lib/trpc';
import Colors from '@/constants/colors';

export default function BackendTest() {
  const [name, setName] = useState('');
  
  const hiMutation = trpc.example.hi.useMutation({
    onSuccess: (data) => {
      Alert.alert('Success!', `Hello ${data.hello}! Date: ${data.date}`);
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    hiMutation.mutate({ name: name.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Test</Text>
      <Text style={styles.subtitle}>Test the tRPC connection</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={Colors.textSecondary}
      />
      
      <TouchableOpacity 
        style={[styles.button, hiMutation.isPending && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={hiMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {hiMutation.isPending ? 'Sending...' : 'Say Hi!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});