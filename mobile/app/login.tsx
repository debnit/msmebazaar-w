
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Chrome, Globe } from 'lucide-react-native';
import i18n from '@/i18n';


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [locale, setLocale] = useState(i18n.locale);
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

  const handleLanguageChange = () => {
    const newLocale = locale === 'en' ? 'hi' : 'en';
    i18n.locale = newLocale;
    setLocale(newLocale);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        <View className="py-12">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-bold text-primary mb-2">{i18n.t('login.title')}</Text>
                <Text className="text-muted-foreground">
                  {i18n.t('login.subtitle')}
                </Text>
              </View>
              <TouchableOpacity onPress={handleLanguageChange} className="flex-row items-center space-x-1 border border-border p-2 rounded-md">
                  <Globe size={16} color="#1e2a4a" />
                  <Text className="font-semibold text-primary">{locale.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">{i18n.t('login.emailLabel')}</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border px-3 py-3 rounded-md text-foreground ${errors.email ? 'border-destructive' : 'border-input bg-background'}`}
                      placeholder={i18n.t('login.emailPlaceholder')}
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
                  <Text className="text-sm font-medium text-foreground">{i18n.t('login.passwordLabel')}</Text>
                  <TouchableOpacity>
                    <Text className="text-sm text-primary underline">{i18n.t('login.forgotPassword')}</Text>
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
                    {i18n.t('login.submit')}
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
                  {i18n.t('login.noAccount')}{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text className="text-primary underline font-semibold">{i18n.t('login.signUp')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
