
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiService, PlantAndMachineryOnboardingData } from '@/services/apiService';
import { Wrench, Send } from 'lucide-react-native';

export default function PlantMachineryOnboardingScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PlantAndMachineryOnboardingData>({
    requestType: 'buy',
    machineryDetails: '',
    name: '',
    phone: '',
    details: '',
  });

  const updateFormData = (field: keyof PlantAndMachineryOnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async () => {
    if (!formData.machineryDetails || !formData.name || !formData.phone || !formData.details) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await apiService.submitPlantAndMachineryRequest(formData);
    if (result.success) {
      Alert.alert(
        'Request Submitted!',
        'Thank you for providing your details. Our team will contact you shortly.',
        [{ text: 'OK', onPress: () => router.push('/(user)/dashboard') }]
      );
    } else {
      Alert.alert('Submission Failed', result.error || 'An unexpected error occurred.');
    }
    setIsSubmitting(false);
  };

  const requestTypes = ['buy', 'sell', 'lease'];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center p-6">
        <View className="py-6">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Wrench size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">Plant & Machinery</Text>
              </View>
              <Text className="text-muted-foreground">
                Please provide the following details for your request.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">I want to...</Text>
                 <View className="flex-row space-x-2">
                    {requestTypes.map(type => (
                      <TouchableOpacity
                        key={type}
                        className={`flex-1 py-3 rounded-md ${formData.requestType === type ? 'bg-primary' : 'bg-secondary'}`}
                        onPress={() => updateFormData('requestType', type)}
                      >
                        <Text className={`text-center font-semibold capitalize ${formData.requestType === type ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Plant & Machinery Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., CNC Machine Model X, 5-ton capacity crane"
                  value={formData.machineryDetails}
                  onChangeText={(text) => updateFormData('machineryDetails', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
               <View>
                <Text className="text-sm font-medium text-foreground mb-2">Your Name</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Contact Phone Number</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="A number our team can reach you on"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Additional Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g. Budget, location, condition, etc."
                  value={formData.details}
                  onChangeText={(text) => updateFormData('details', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
              
              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
