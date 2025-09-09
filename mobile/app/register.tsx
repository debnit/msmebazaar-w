import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Registration Failed', result.error || 'An unexpected error occurred');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-12">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-primary mb-2">Register</Text>
              <Text className="text-muted-foreground">
                Create an account to get started with our services.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Name</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Confirm Password</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className={`py-4 px-6 rounded-lg ${isLoading ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text className="text-accent-foreground text-center font-semibold text-lg">
                  {isLoading ? 'Creating Account...' : 'Create account'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 pt-6 border-t border-border">
              <View className="flex-row justify-center items-center mb-4">
                <View className="flex-1 h-px bg-border" />
                <Text className="px-4 text-xs text-muted-foreground uppercase">Or continue with</Text>
                <View className="flex-1 h-px bg-border" />
              </View>
              
              <TouchableOpacity className="border border-border py-4 px-6 rounded-lg">
                <Text className="text-foreground text-center font-semibold">
                  Sign up with Google
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 pt-6 border-t border-border">
              <Text className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text className="text-primary underline font-semibold">Log in</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
