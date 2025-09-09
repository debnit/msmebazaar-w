import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { HandCoins, FileText, Banknote, Rocket } from 'lucide-react-native';

const features = [
  {
    icon: <HandCoins size={40} color="#1e2a4a" />,
    title: "Quick Business Loans",
    description: "Access capital quickly with our streamlined loan application process. Get funds in as little as 24 hours.",
  },
  {
    icon: <FileText size={40} color="#1e2a4a" />,
    title: "Easy Enquiry",
    description: "Have questions? Our simple enquiry form connects you with our experts to get the answers you need.",
  },
  {
    icon: <Banknote size={40} color="#1e2a4a" />,
    title: "Seamless Payments",
    description: "Integrate our secure payment gateway to accept payments from customers effortlessly. Powered by Razorpay.",
  },
  {
    icon: <Rocket size={40} color="#1e2a4a" />,
    title: "Grow Your Business",
    description: "From registration to scaling, we provide the tools and financial support to fuel your growth journey.",
  },
];

export default function HomeScreen() {
  const { isAuthenticated } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="bg-card px-6 py-12">
          <View className="items-center space-y-6">
            <Text className="text-4xl font-bold text-primary text-center">
              Unlock Your Business Potential
            </Text>
            <Text className="text-lg text-muted-foreground text-center px-4">
              MSMEConnect provides fast, flexible financing and seamless payment solutions to help your small business thrive.
            </Text>
            <View className="w-full space-y-4">
              <TouchableOpacity 
                className="bg-accent py-4 px-6 rounded-lg"
                onPress={() => router.push('/loan')}
              >
                <Text className="text-accent-foreground text-center font-semibold text-lg">
                  Apply for a Loan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="border border-primary py-4 px-6 rounded-lg"
                onPress={() => router.push('/enquiry')}
              >
                <Text className="text-primary text-center font-semibold text-lg">
                  Contact Sales
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="px-6 py-12">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-primary text-center mb-4">
              Solutions Tailored for Your Business
            </Text>
            <Text className="text-lg text-muted-foreground text-center">
              We offer a comprehensive suite of services designed to meet the unique needs of micro, small, and medium enterprises.
            </Text>
          </View>
          
          <View className="space-y-6">
            {features.map((feature, index) => (
              <View key={index} className="bg-card p-6 rounded-lg shadow-sm">
                <View className="items-center mb-4">
                  <View className="bg-secondary p-4 rounded-full mb-4">
                    {feature.icon}
                  </View>
                  <Text className="text-xl font-semibold text-center mb-2">
                    {feature.title}
                  </Text>
                  <Text className="text-muted-foreground text-center text-sm">
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View className="px-6 py-12">
          <View className="bg-primary p-8 rounded-lg">
            <Text className="text-3xl font-bold text-primary-foreground text-center mb-4">
              Ready to Grow Your Business?
            </Text>
            <Text className="text-lg text-primary-foreground/80 text-center mb-8">
              Join thousands of MSMEs who trust us to power their growth. Get started today with a simple registration.
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

        {/* Action Buttons */}
        <View className="px-6 pb-12 space-y-4">
          <TouchableOpacity 
            className="bg-accent py-4 px-6 rounded-lg"
            onPress={() => router.push('/enquiry')}
          >
            <Text className="text-accent-foreground text-center font-semibold text-lg">
              Submit Enquiry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="border border-primary py-4 px-6 rounded-lg"
            onPress={() => router.push('/loan')}
          >
            <Text className="text-primary text-center font-semibold text-lg">
              Apply for Loan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
