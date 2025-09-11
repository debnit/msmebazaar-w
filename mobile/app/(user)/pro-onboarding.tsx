
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiService } from '@/services/apiService';
import { Check, Send } from 'lucide-react-native';

export default function ProOnboardingScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessNature: '',
    helpNeeded: '',
    consultationNotes: '',
  });

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.businessNature || !formData.helpNeeded || !formData.consultationNotes) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await apiService.submitProProfile(formData);
    if (result.success) {
      Alert.alert(
        'Onboarding Complete!',
        'Thank you for providing your details. Our team will be in touch shortly.',
        [{ text: 'OK', onPress: () => router.push('/(user)/dashboard') }]
      );
    } else {
      Alert.alert('Submission Failed', result.error || 'An unexpected error occurred');
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center p-6">
        <View className="py-6">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Check size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">Welcome to Pro!</Text>
              </View>
              <Text className="text-muted-foreground">
                To get started, please tell us a little about your business.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Name of your Business</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., Acme Innovations Pvt. Ltd."
                  value={formData.businessName}
                  onChangeText={(text) => updateFormData('businessName', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Nature of Business</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., Manufacturing, IT Services"
                  value={formData.businessNature}
                  onChangeText={(text) => updateFormData('businessNature', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">What do you need help with?</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., Selling products, Raw materials"
                  value={formData.helpNeeded}
                  onChangeText={(text) => updateFormData('helpNeeded', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Book a Consultation</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="What would you like to discuss? Suggest a few preferred time slots."
                  value={formData.consultationNotes}
                  onChangeText={(text) => updateFormData('consultationNotes', text)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ minHeight: 120 }}
                />
              </View>

              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
