
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiService, ValuationOnboardingData } from '@/services/apiService';
import { BarChart, Send, Upload, File } from 'lucide-react-native';

export default function ValuationOnboardingScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ValuationOnboardingData>({
    turnover: 0,
    assets: '',
    liabilities: '',
    phone: '',
    balanceSheetUrl: '',
    gstReturnsUrl: '',
  });

  const updateFormData = (field: keyof ValuationOnboardingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Mock file picking function
  const pickDocument = async (field: 'balanceSheetUrl' | 'gstReturnsUrl') => {
      // In a real app, you'd use a library like expo-document-picker
      Alert.alert("File Selection", "File upload functionality is not implemented in this prototype. We will proceed with a placeholder file name.");
      updateFormData(field, `placeholder_${field}.pdf`);
  };

  const handleSubmit = async () => {
    if (!formData.turnover || !formData.assets || !formData.liabilities || !formData.phone) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await apiService.submitValuationRequest(formData);
    if (result.success) {
      Alert.alert(
        'Details Submitted!',
        'Thank you for providing your business details. Our team will review them and reach out to you shortly with your valuation report.',
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
                <BarChart size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">Valuation Details</Text>
              </View>
              <Text className="text-muted-foreground">
                Please provide the following financial details for your valuation.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Annual Turnover (₹)</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g. 5000000"
                  value={formData.turnover > 0 ? formData.turnover.toString() : ''}
                  onChangeText={(text) => updateFormData('turnover', parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Total Assets</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="List your significant assets (e.g., machinery, property)"
                  value={formData.assets}
                  onChangeText={(text) => updateFormData('assets', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Total Liabilities</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="List your significant liabilities (e.g., loans, debts)"
                  value={formData.liabilities}
                  onChangeText={(text) => updateFormData('liabilities', text)}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
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

              {/* File Uploads */}
              <View>
                 <Text className="text-sm font-medium text-foreground mb-2">Upload Balance Sheet (Optional)</Text>
                 <TouchableOpacity onPress={() => pickDocument('balanceSheetUrl')} className="border border-dashed border-input p-4 rounded-md flex-row items-center justify-center">
                    {formData.balanceSheetUrl ? <File size={16} color="#10b981" /> : <Upload size={16} color="#6b7280" />}
                    <Text className="ml-2 text-muted-foreground">{formData.balanceSheetUrl ? formData.balanceSheetUrl : "Tap to select file"}</Text>
                 </TouchableOpacity>
              </View>
               <View>
                 <Text className="text-sm font-medium text-foreground mb-2">Upload GST Returns (Optional)</Text>
                 <TouchableOpacity onPress={() => pickDocument('gstReturnsUrl')} className="border border-dashed border-input p-4 rounded-md flex-row items-center justify-center">
                    {formData.gstReturnsUrl ? <File size={16} color="#10b981" /> : <Upload size={16} color="#6b7280" />}
                    <Text className="ml-2 text-muted-foreground">{formData.gstReturnsUrl ? formData.gstReturnsUrl : "Tap to select file"}</Text>
                 </TouchableOpacity>
              </View>

              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : 'Submit Valuation Details'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
