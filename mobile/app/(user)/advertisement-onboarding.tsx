
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { apiService, AdvertisementOnboardingData } from '@/services/apiService';
import { Megaphone, Send, Upload, File, Video } from 'lucide-react-native';

export default function AdvertisementOnboardingScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdvertisementOnboardingData>({
    businessName: '',
    businessNature: '',
    businessAddress: '',
    contactDetails: '',
    photosUrl: '',
    videosUrl: '',
  });

  const updateFormData = (field: keyof AdvertisementOnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Mock file picking function
  const pickFile = async (field: 'photosUrl' | 'videosUrl') => {
      // In a real app, you'd use a library like expo-document-picker or expo-image-picker
      Alert.alert("File Selection", "File upload functionality is not implemented in this prototype. We will proceed with a placeholder file name.");
      updateFormData(field, `placeholder_${field}.zip`);
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.businessNature || !formData.businessAddress || !formData.contactDetails) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await apiService.submitAdvertisement(formData);
    if (result.success) {
      Alert.alert(
        'Details Submitted!',
        'Thank you! Our team will get back to you in 15 minutes.',
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
                <Megaphone size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">Advertise Your Business</Text>
              </View>
              <Text className="text-muted-foreground">
                Provide your business details below.
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Business Name</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., Creative Weavers"
                  value={formData.businessName}
                  onChangeText={(text) => updateFormData('businessName', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Nature of Business</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., Handicrafts, Technology"
                  value={formData.businessNature}
                  onChangeText={(text) => updateFormData('businessNature', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Business Address</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="Your full business address"
                  value={formData.businessAddress}
                  onChangeText={(text) => updateFormData('businessAddress', text)}
                  multiline
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Contact Details</Text>
                <TextInput
                  className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                  placeholder="e.g., your@email.com or phone number"
                  value={formData.contactDetails}
                  onChangeText={(text) => updateFormData('contactDetails', text)}
                />
              </View>
              
              {/* File Uploads */}
              <View>
                 <Text className="text-sm font-medium text-foreground mb-2">Upload Photos (Optional)</Text>
                 <TouchableOpacity onPress={() => pickFile('photosUrl')} className="border border-dashed border-input p-4 rounded-md flex-row items-center justify-center">
                    {formData.photosUrl ? <File size={16} color="#10b981" /> : <Upload size={16} color="#6b7280" />}
                    <Text className="ml-2 text-muted-foreground">{formData.photosUrl ? formData.photosUrl : "Tap to select photos"}</Text>
                 </TouchableOpacity>
              </View>
               <View>
                 <Text className="text-sm font-medium text-foreground mb-2">Upload Videos (Optional)</Text>
                 <TouchableOpacity onPress={() => pickFile('videosUrl')} className="border border-dashed border-input p-4 rounded-md flex-row items-center justify-center">
                    {formData.videosUrl ? <Video size={16} color="#10b981" /> : <Upload size={16} color="#6b7280" />}
                    <Text className="ml-2 text-muted-foreground">{formData.videosUrl ? formData.videosUrl : "Tap to select videos"}</Text>
                 </TouchableOpacity>
              </View>

              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : 'Submit Details'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
