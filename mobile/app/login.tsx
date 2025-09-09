import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.replace('/dashboard');
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-12">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-primary mb-2">Login</Text>
              <Text className="text-muted-foreground">
                Enter your email below to login to your account.
              </Text>
            </View>

            <View className="space-y-4">
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
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium text-foreground">Password</Text>
                  <TouchableOpacity>
                    <Text className="text-sm text-primary underline">Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className={`py-4 px-6 rounded-lg ${isLoading ? 'bg-muted' : 'bg-primary'}`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text className="text-primary-foreground text-center font-semibold text-lg">
                  {isLoading ? 'Logging in...' : 'Login'}
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
                  Login with Google
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 pt-6 border-t border-border">
              <Text className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text className="text-primary underline font-semibold">Sign up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
