
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { apiService, LoanApplicationData } from '@/services/apiService';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
  const [formData, setFormData] = useState<Omit<LoanApplicationData, 'paymentId'>>({
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
  });

  const updateFormData = (field: keyof typeof formData, value: string | number) => {
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
    if (validateStep(currentStep)) {
      if(currentStep === steps.length) {
        handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
    else Alert.alert('Validation Error', 'Please fill in all fields correctly to continue.');
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await AsyncStorage.setItem('loanApplicationData', JSON.stringify(formData));
      Alert.alert(
        'Details Saved',
        'Please complete the payment to submit your application.',
        [{ text: 'OK', onPress: () => router.push({ pathname: '/(user)/payments', params: { service: 'Quick Business Loan File Processing' }}) }]
      );
    } catch (e) {
       Alert.alert('Error', 'Could not save your details. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const renderStepContent = () => {
    switch(currentStep) {
        case 1:
            return (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.fullName} onChangeText={t => updateFormData('fullName', t)} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.email} onChangeText={t => updateFormData('email', t)} keyboardType="email-address"/>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Phone</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.phone} onChangeText={t => updateFormData('phone', t)} keyboardType="phone-pad"/>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">PAN</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.pan} onChangeText={t => updateFormData('pan', t.toUpperCase())} autoCapitalize="characters" maxLength={10}/>
                  </View>
                </View>
            );
        case 2:
             return (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Business Name</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.businessName} onChangeText={t => updateFormData('businessName', t)} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Business Type</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.businessType} onChangeText={t => updateFormData('businessType', t)} />
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Years In Business</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={String(formData.yearsInBusiness)} onChangeText={t => updateFormData('yearsInBusiness', Number(t))} keyboardType="numeric"/>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Annual Turnover (₹)</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={String(formData.annualTurnover)} onChangeText={t => updateFormData('annualTurnover', Number(t))} keyboardType="numeric" />
                  </View>
                </View>
             );
        case 3:
            return (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Loan Amount (₹)</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={String(formData.loanAmount)} onChangeText={t => updateFormData('loanAmount', Number(t))} keyboardType="numeric"/>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Loan Purpose</Text>
                    <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" value={formData.loanPurpose} onChangeText={t => updateFormData('loanPurpose', t)} />
                  </View>
                </View>
            );
        default: return null;
    }
  }

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

              <TouchableOpacity className="flex-row items-center bg-primary py-3 px-6 rounded-lg" onPress={handleNext} disabled={isSubmitting}>
                  {isSubmitting ? <ActivityIndicator color="#ffffff"/> : 
                  <>
                    <Text className="text-primary-foreground font-semibold mr-2">{currentStep < steps.length ? 'Next Step' : 'Proceed to Payment'}</Text>
                    {currentStep < steps.length ? <ArrowRight size={16} color="#ffffff" /> : <Send size={16} color="#ffffff" />}
                  </>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
