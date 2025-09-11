
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/apiService';
import { User, Upload, Save } from 'lucide-react-native';

export default function ProfileEditScreen() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = () => {
    // In a real app, this would open the image picker.
    // For now, we'll just use a placeholder from picsum.photos
    const newImageUrl = `https://picsum.photos/seed/${Math.random()}/200`;
    setProfilePictureUrl(newImageUrl);
  };
  
  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    
    setIsSubmitting(true);
    const result = await apiService.updateUserProfile({ name, profilePictureUrl });
    if(result.success) {
        Alert.alert("Success", "Your profile has been updated.", [{ text: 'OK', onPress: () => router.back() }]);
    } else {
        Alert.alert("Error", result.error || "Failed to update your profile.");
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
        <View className="bg-card p-6 rounded-lg shadow-sm">
          <View className="mb-6 items-center">
            <TouchableOpacity onPress={handlePickImage} className="relative mb-4">
              <Image 
                source={{ uri: profilePictureUrl || 'https://i.pravatar.cc/150?u=' + user?.id }}
                className="h-32 w-32 rounded-full"
              />
              <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-card">
                <Upload size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-primary">Edit Profile</Text>
          </View>
          
          <View className="space-y-6">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
              <TextInput 
                className="border border-input bg-muted px-4 py-3 rounded-lg text-muted-foreground"
                value={user?.email}
                editable={false}
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">Full Name</Text>
              <TextInput 
                className="border border-input bg-background px-4 py-3 rounded-lg text-foreground"
                value={name}
                onChangeText={setName}
              />
            </View>
            <TouchableOpacity
              className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Save size={20} color="#ffffff" />}
              <Text className="text-accent-foreground font-semibold ml-2">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
