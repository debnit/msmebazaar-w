
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiService, NavArambhOnboardingData } from '@/services/apiService';
import { Route, Send } from 'lucide-react-native';

export default function NavArambhOnboardingScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NavArambhOnboardingData>({
    assetDetails: '',
    turnoverDetails: '',
    loanDetails: '',
    problemDetails: '',
    contactDetails: '',
  });

  const updateFormData = (field: keyof NavArambhOnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    if (!formData.assetDetails || !formData.turnoverDetails || !formData.loanDetails || !formData.problemDetails || !formData.contactDetails) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await apiService.submitNavArambhRequest(formData);
    if (result.success) {
      Alert.alert(
        'Details Submitted!',
        'Thank you for providing your business details. Our team will reach out to you within 5 minutes.',
        [{ text: 'OK', onPress: () => router.push('/(user)/dashboard') }]
      );
    } else {
      Alert.alert('Submission Failed', result.error || 'An unexpected error occurred.');
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
                <Route size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">NavArambh Onboarding</Text>
              </View>
              <Text className="text-muted-foreground">
                Please provide the following details so our team can assist you effectively.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Asset Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="List your key business assets"
                  value={formData.assetDetails}
                  onChangeText={(text) => updateFormData('assetDetails', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Turnover Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., Annual turnover, monthly revenue"
                  value={formData.turnoverDetails}
                  onChangeText={(text) => updateFormData('turnoverDetails', text)}
                   multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Loan Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="List any outstanding business loans"
                  value={formData.loanDetails}
                  onChangeText={(text) => updateFormData('loanDetails', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
               <View>
                <Text className="text-sm font-medium text-foreground mb-2">Problem Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="Describe the challenges your business is facing"
                  value={formData.problemDetails}
                  onChangeText={(text) => updateFormData('problemDetails', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Best Contact Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="Phone number or email for our team to reach you"
                  value={formData.contactDetails}
                  onChangeText={(text) => updateFormData('contactDetails', text)}
                />
              </View>
              
              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : 'Submit and Get a Call'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
