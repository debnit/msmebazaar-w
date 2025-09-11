
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiService, EnquiryData } from '@/services/apiService';
import { MessageSquare, Send } from 'lucide-react-native';

export default function EnquiryScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EnquiryData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const updateFormData = (field: keyof EnquiryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (formData.message.length < 10) {
      Alert.alert('Validation Error', 'Message must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiService.submitEnquiry(formData);
      if (result.success) {
        Alert.alert(
          'Enquiry Submitted',
          'Thank you for reaching out! Our team will review your message and get back to you shortly.',
          [{ text: 'OK', onPress: () => router.push('/(user)/dashboard') }]
        );
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        Alert.alert('Submission Failed', result.error || 'An unexpected error occurred');
      }
    } catch (error) {
      Alert.alert('Submission Failed', 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = [
    { value: 'loan_enquiry', label: 'Loan Enquiry' },
    { value: 'payment_gateway', label: 'Payment Gateway' },
    { value: 'general_question', label: 'General Question' },
    { value: 'partnership', label: 'Partnership' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center p-6">
        <View className="py-6">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <MessageSquare size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">Contact Our Experts</Text>
              </View>
              <Text className="text-muted-foreground">
                Have a question or need assistance? Fill out the form and we will get back to you shortly.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Email Address</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Phone Number</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Subject</Text>
                <View className="border border-input bg-background rounded-md">
                   {/* This would be better as a proper picker, but for consistency with web, we use buttons */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="p-2">
                    {subjects.map((subject) => (
                      <TouchableOpacity
                        key={subject.value}
                        className={`px-4 py-2 rounded-full mr-2 ${formData.subject === subject.value ? 'bg-primary' : 'bg-secondary'}`}
                        onPress={() => updateFormData('subject', subject.value)}
                      >
                        <Text className={`text-sm ${formData.subject === subject.value ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {subject.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Your Message</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="Tell us more about your needs..."
                  value={formData.message}
                  onChangeText={(text) => updateFormData('message', text)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ minHeight: 120 }}
                />
                <Text className="text-xs text-muted-foreground mt-1 text-right">
                  {formData.message.length} / 10 minimum characters
                </Text>
              </View>

              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
