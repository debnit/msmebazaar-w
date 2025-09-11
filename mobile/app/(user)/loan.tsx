
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
  });

  const updateFormData = (field: keyof LoanApplicationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan));
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="John Doe" value={formData.fullName} onChangeText={(text) => updateFormData('fullName', text)} />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="john.doe@example.com" value={formData.email} onChangeText={(text) => updateFormData('email', text)} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Phone Number</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="+91 98765 43210" value={formData.phone} onChangeText={(text) => updateFormData('phone', text)} keyboardType="phone-pad" />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">PAN Card Number</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="ABCDE1234F" value={formData.pan} onChangeText={(text) => updateFormData('pan', text.toUpperCase())} autoCapitalize="characters" maxLength={10} />
            </View>
          </View>
        );
      case 2:
        return (
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Business Name</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="Acme Inc." value={formData.businessName} onChangeText={(text) => updateFormData('businessName', text)} />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Type of Business</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="py-2">
                {['Sole Proprietorship', 'Partnership', 'Private Limited', 'Other'].map((type) => (
                  <TouchableOpacity key={type} className={`px-4 py-2 rounded-full mr-2 ${formData.businessType === type.toLowerCase().replace(/ /g, '-') ? 'bg-primary' : 'bg-secondary'}`} onPress={() => updateFormData('businessType', type.toLowerCase().replace(/ /g, '-'))}>
                    <Text className={`text-sm ${formData.businessType === type.toLowerCase().replace(/ /g, '-') ? 'text-primary-foreground' : 'text-foreground'}`}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Years in Business</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="e.g., 5" value={formData.yearsInBusiness > 0 ? formData.yearsInBusiness.toString() : ''} onChangeText={(text) => updateFormData('yearsInBusiness', parseInt(text) || 0)} keyboardType="numeric" />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Annual Turnover (in ₹)</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="e.g., 500000" value={formData.annualTurnover > 0 ? formData.annualTurnover.toString() : ''} onChangeText={(text) => updateFormData('annualTurnover', parseInt(text) || 0)} keyboardType="numeric" />
            </View>
          </View>
        );
      case 3:
        return (
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Loan Amount Required (in ₹)</Text>
              <TextInput className="border border-input bg-background px-3 py-3 rounded-md text-foreground" placeholder="e.g., 200000" value={formData.loanAmount > 0 ? formData.loanAmount.toString() : ''} onChangeText={(text) => updateFormData('loanAmount', parseInt(text) || 0)} keyboardType="numeric" />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Purpose of Loan</Text>
               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="py-2">
                  {['Working Capital', 'Business Expansion', 'Equipment Purchase', 'Other'].map((purpose) => (
                    <TouchableOpacity key={purpose} className={`px-4 py-2 rounded-full mr-2 ${formData.loanPurpose === purpose.toLowerCase().replace(/ /g, '-') ? 'bg-primary' : 'bg-secondary'}`} onPress={() => updateFormData('loanPurpose', purpose.toLowerCase().replace(/ /g, '-'))}>
                      <Text className={`text-sm ${formData.loanPurpose === purpose.toLowerCase().replace(/ /g, '-') ? 'text-primary-foreground' : 'text-foreground'}`}>{purpose}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
            </View>
          </View>
        );
      default: return null;
    }
  };

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
