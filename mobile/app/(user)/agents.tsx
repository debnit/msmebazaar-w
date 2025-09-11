
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Zap, Shield, Handshake, CheckCircle } from 'lucide-react-native';

const agentBenefits = [
    {
        icon: <Zap size={24} color="#1e2a4a" />,
        title: "Competitive Commissions",
        description: "Earn attractive commissions on every successful deal you bring to the platform.",
    },
    {
        icon: <Shield size={24} color="#1e2a4a" />,
        title: "Access Exclusive Deals",
        description: "Get access to a pipeline of curated loan applications, valuation requests, and exit strategy clients.",
    },
    {
        icon: <Handshake size={24} color="#1e2a4a" />,
        title: "Marketing & Sales Support",
        description: "Leverage our brand and marketing materials to attract more clients.",
    },
    {
        icon: <CheckCircle size={24} color="#1e2a4a" />,
        title: "Dedicated Agent Portal",
        description: "Track your leads, manage your pipeline, and monitor your earnings through our easy-to-use agent dashboard.",
    },
];

export default function AgentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
        <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary text-center">
              Partner with Us. Grow Your Business.
            </Text>
            <Text className="text-lg text-muted-foreground text-center mt-2">
              Join the MSMEConnect Agent Network and unlock a new stream of revenue.
            </Text>
        </View>

        <View className="space-y-6 mb-8">
            {agentBenefits.map((item, index) => (
                <View key={index} className="bg-card p-4 rounded-lg shadow-sm flex-row items-center space-x-4">
                    <View className="bg-secondary p-3 rounded-full">
                        {item.icon}
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-primary">{item.title}</Text>
                        <Text className="text-muted-foreground text-sm">{item.description}</Text>
                    </View>
                </View>
            ))}
        </View>
        
        <TouchableOpacity 
          className="bg-accent py-4 px-6 rounded-lg"
          onPress={() => router.push('/register')}
        >
          <Text className="text-accent-foreground text-center font-semibold text-lg">
            Register as an Agent
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
