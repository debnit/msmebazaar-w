
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Chrome } from 'lucide-react-native';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await login(values.email, values.password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
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
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border px-3 py-3 rounded-md text-foreground ${errors.email ? 'border-destructive' : 'border-input bg-background'}`}
                      placeholder="name@example.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.email && <Text className="text-destructive text-sm mt-1">{errors.email.message}</Text>}
              </View>

              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium text-foreground">Password</Text>
                  <TouchableOpacity>
                    <Text className="text-sm text-primary underline">Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border px-3 py-3 rounded-md text-foreground ${errors.password ? 'border-destructive' : 'border-input bg-background'}`}
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                    />
                  )}
                />
                {errors.password && <Text className="text-destructive text-sm mt-1">{errors.password.message}</Text>}
              </View>

              <TouchableOpacity
                className={`py-4 px-6 rounded-lg flex-row justify-center items-center ${isLoading ? 'bg-muted' : 'bg-primary'}`}
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-primary-foreground text-center font-semibold text-lg">
                    Login
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View className="relative my-6">
              <View className="absolute inset-0 flex items-center">
                <View className="w-full border-t border-border" />
              </View>
              <View className="relative flex justify-center">
                <Text className="bg-card px-2 text-xs text-muted-foreground uppercase">Or continue with</Text>
              </View>
            </View>
              
            <TouchableOpacity className="border border-border py-4 px-6 rounded-lg flex-row justify-center items-center">
              <Chrome size={20} color="#1e2a4a" />
              <Text className="text-foreground text-center font-semibold ml-2">
                Login with Google
              </Text>
            </TouchableOpacity>

            <View className="mt-6 pt-6 border-t border-border">
              <View className="flex-row justify-center items-center">
                <Text className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text className="text-primary underline font-semibold">Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
