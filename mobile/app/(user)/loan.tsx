
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { apiService, LoanApplicationData } from '@/services/apiService';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';

const steps = [
  { id: 1, title: "Personal Information", description: "Let's start with the basics. Please provide your personal details." },
  { id: 2, title: "Business Information", description: "Tell us about your business. This helps us understand your venture." },
  { id: 3, title: "Loan Details", description: "Specify your funding needs. What are your goals?" },
];

export default function LoanScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { paymentId } = useLocalSearchParams();
  
  const [formData, setFormData] = useState<LoanApplicationData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    pan: '',
    businessName: '',
    businessType: '',
    yearsInBusiness: 0,
    annualTurnover: 0,
    loanAmount: 10000,
    loanPurpose: '',
    paymentId: typeof paymentId === 'string' ? paymentId : undefined,
  });

  const updateFormData = (field: keyof LoanApplicationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan));
      case 2:
        return !!(formData.businessName && formData.businessType && formData.yearsInBusiness > 0 && formData.annualTurnover > 0);
      case 3:
        return !!(formData.loanAmount >= 10000 && formData.loanPurpose);
      default: return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
    else Alert.alert('Validation Error', 'Please fill in all fields correctly to continue.');
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      Alert.alert('Validation Error', 'Please complete all steps correctly.');
      return;
    }
    setIsSubmitting(true);
    const result = await apiService.submitLoanApplication(formData);
    if (result.success) {
      Alert.alert('Application Submitted!', 'We have received your loan application and will be in touch soon.',
        [{ text: 'OK', onPress: () => router.push('/(user)/dashboard') }]
      );
    } else {
      Alert.alert('Submission Failed', result.error || 'An unexpected error occurred');
    }
    setIsSubmitting(false);
  };

  const progress = (currentStep / steps.length) * 100;
  const currentStepInfo = steps[currentStep-1];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center p-6">
        <View className="py-6">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <Text className="text-xl font-bold text-primary mb-1">{currentStepInfo.title}</Text>
              <Text className="text-muted-foreground text-sm mb-4">{currentStepInfo.description}</Text>
              <View className="w-full bg-secondary rounded-full h-2 mb-2">
                <View className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
              </View>
              <Text className="text-sm text-muted-foreground self-end">Step {currentStep} of {steps.length}</Text>
            </View>

            {renderStepContent()}

            <View className="flex-row justify-between mt-8">
              {currentStep > 1 ? (
                <TouchableOpacity className="flex-row items-center border border-border py-3 px-6 rounded-lg" onPress={handlePrev}>
                  <ArrowLeft size={16} color="#1e2a4a" />
                  <Text className="ml-2 text-foreground font-semibold">Previous</Text>
                </TouchableOpacity>
              ) : <View />}

              {currentStep < steps.length ? (
                <TouchableOpacity className="flex-row items-center bg-primary py-3 px-6 rounded-lg" onPress={handleNext}>
                  <Text className="text-primary-foreground font-semibold mr-2">Next Step</Text>
                  <ArrowRight size={16} color="#ffffff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className={`flex-row items-center py-3 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`} onPress={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <ActivityIndicator color="#ffffff"/> : <Send size={16} color="#ffffff" />}
                  <Text className="text-accent-foreground font-semibold ml-2">{isSubmitting ? 'Submitting...' : 'Submit Application'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
