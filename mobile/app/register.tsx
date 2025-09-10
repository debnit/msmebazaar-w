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
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", referralCode: "" },
  });

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { confirmPassword, ...registerData } = values;
    const result = await register(registerData);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'An unexpected error occurred');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
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
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border px-3 py-3 rounded-md text-foreground ${errors.name ? 'border-destructive' : 'border-input bg-background'}`}
                      placeholder="John Doe"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                  )}
                />
                 {errors.name && <Text className="text-destructive text-sm mt-1">{errors.name.message}</Text>}
              </View>

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
                    />
                  )}
                />
                 {errors.email && <Text className="text-destructive text-sm mt-1">{errors.email.message}</Text>}
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
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

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border px-3 py-3 rounded-md text-foreground ${errors.confirmPassword ? 'border-destructive' : 'border-input bg-background'}`}
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                    />
                  )}
                />
                {errors.confirmPassword && <Text className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</Text>}
              </View>
              
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Referral Code (Optional)</Text>
                 <Controller
                  control={control}
                  name="referralCode"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border px-3 py-3 rounded-md text-foreground ${errors.referralCode ? 'border-destructive' : 'border-input bg-background'}`}
                      placeholder="Enter referral code"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="characters"
                    />
                  )}
                />
                {errors.referralCode && <Text className="text-destructive text-sm mt-1">{errors.referralCode.message}</Text>}
              </View>

              <TouchableOpacity
                className={`py-4 px-6 rounded-lg flex-row justify-center items-center ${isLoading ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit(handleRegister)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-accent-foreground text-center font-semibold text-lg">
                    Create account
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
                Sign up with Google
              </Text>
            </TouchableOpacity>

            <View className="mt-6 pt-6 border-t border-border">
              <View className="flex-row justify-center items-center">
                <Text className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text className="text-primary underline font-semibold">Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
