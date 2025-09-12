
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { HandCoins, FileText, Banknote, Rocket, Route, Award, BrainCircuit, Megaphone } from 'lucide-react-native';

const features = [
  {
    icon: <Route size={32} color="#1e2a4a" />,
    title: "NavArambh Exit Strategy",
    description: "Our flagship service provides comprehensive business valuation and strategic guidance for a profitable exit, ensuring you get the maximum value for your hard work.",
    onPress: () => router.push('/payments')
  },
  {
    icon: <Megaphone size={32} color="#1e2a4a" />,
    title: "Advertise Your Business",
    description: "Get your business noticed. We help create and boost your online presence to reach a wider audience.",
    onPress: () => router.push('/payments')
  },
  {
    icon: <BrainCircuit size={32} color="#1e2a4a" />,
    title: "AI Business Plan",
    description: "Generate a foundational business plan in minutes. Our AI helps structure your ideas and create a professional plan to guide your venture.",
    onPress: () => router.push('/(user)/business-plan')
  },
  {
    icon: <HandCoins size={32} color="#1e2a4a" />,
    title: "Quick Business Loans",
    description: "Access working capital, expand your operations, or purchase new equipment with our streamlined loan application process designed for the speed of business.",
    onPress: () => router.push('/(user)/loan')
  },
  {
    icon: <Award size={32} color="#1e2a4a" />,
    title: "Referral Program",
    description: "Refer other MSMEs to our platform and earn rewards in your wallet. It's our way of saying thank you for helping our community grow.",
    onPress: () => router.push('/register')
  },
];

export default function HomeScreen() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#1e2a4a" />
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    const route = user?.isAdmin ? '/(admin)/dashboard' : '/(user)/dashboard';
    return <Redirect href={route} />;
  }
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="px-6 py-12">
          <View className="space-y-8">
            {/* NavArambh Card */}
            <View className="bg-card p-6 rounded-lg shadow-md">
              <Image 
                source={{ uri: 'https://picsum.photos/seed/exit-strategy/600/400' }}
                className="w-full h-40 rounded-lg mb-4"
              />
              <Text className="text-3xl font-bold text-primary text-left">
                Plan Your Perfect Exit with NavArambh
              </Text>
              <Text className="text-lg text-muted-foreground text-left mt-2">
                Expert valuation and strategic guidance for a profitable exit.
              </Text>
              <TouchableOpacity 
                className="bg-primary py-3 px-6 rounded-lg mt-6"
                onPress={() => router.push('/payments')}
              >
                <Text className="text-primary-foreground text-center font-semibold text-base">
                  Explore Exit Strategies
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Loans Card */}
            <View className="bg-card p-6 rounded-lg shadow-md">
                <Image 
                  source={{ uri: 'https://picsum.photos/seed/business-loan/600/400' }}
                  className="w-full h-40 rounded-lg mb-4"
                />
              <Text className="text-3xl font-bold text-primary text-left">
                Fuel Your Growth with Quick Loans
              </Text>
              <Text className="text-lg text-muted-foreground text-left mt-2">
                Fast, accessible business loans to help you scale your MSME.
              </Text>
              <TouchableOpacity 
                className="bg-accent py-3 px-6 rounded-lg mt-6"
                onPress={() => router.push('/(user)/loan')}
              >
                <Text className="text-accent-foreground text-center font-semibold text-base">
                  Apply for a Loan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="px-6 py-12">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-primary text-center mb-4">
              A Complete Financial Toolkit
            </Text>
            <Text className="text-lg text-muted-foreground text-center">
              From strategic exits to daily operations, we offer a comprehensive suite of services.
            </Text>
          </View>
          
          <View className="space-y-6">
            {features.map((feature, index) => (
              <TouchableOpacity key={index} onPress={feature.onPress}>
                <View className="bg-card p-6 rounded-lg shadow-sm flex-row items-center space-x-4">
                    <View className="bg-secondary p-3 rounded-full">
                      {feature.icon}
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-semibold mb-1">
                        {feature.title}
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        {feature.description}
                      </Text>
                    </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View className="px-6 py-12">
          <View className="bg-primary p-8 rounded-lg">
            <Text className="text-3xl font-bold text-primary-foreground text-center mb-4">
              Ready to Get Started?
            </Text>
            <Text className="text-lg text-primary-foreground/80 text-center mb-8">
              Join thousands of MSMEs who trust us to power their growth. Create your account in minutes.
            </Text>
            <TouchableOpacity 
              className="bg-accent py-4 px-6 rounded-lg"
              onPress={() => router.push('/register')}
            >
              <Text className="text-accent-foreground text-center font-semibold text-lg">
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
