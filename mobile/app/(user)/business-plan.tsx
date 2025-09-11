
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, BusinessPlanData } from '@/services/apiService';
import { Lightbulb, Send } from 'lucide-react-native';

export default function BusinessPlanScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
  });
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.industry || !formData.targetAudience) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setGeneratedPlan(null);
    const result = await apiService.generateBusinessPlan(formData);
    if (result.success && result.plan) {
      setGeneratedPlan(result.plan);
    } else {
      Alert.alert('Generation Failed', result.error || 'Could not generate business plan.');
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
        <View className="bg-card p-6 rounded-lg shadow-sm">
          <View className="mb-6 items-center">
            <Lightbulb size={32} color="#1e2a4a" />
            <Text className="text-2xl font-bold text-primary mt-2">AI Business Plan Generator</Text>
            <Text className="text-muted-foreground text-center mt-1">
              Answer a few questions and let our AI create a foundational business plan for you.
            </Text>
          </View>

          {!generatedPlan ? (
            <View className="space-y-6">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Business Name</Text>
                <TextInput
                  className="border border-input bg-background px-4 py-3 rounded-lg text-foreground"
                  placeholder="e.g., Creative Weaves"
                  value={formData.businessName}
                  onChangeText={(text) => updateFormData('businessName', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Industry</Text>
                <TextInput
                  className="border border-input bg-background px-4 py-3 rounded-lg text-foreground"
                  placeholder="e.g., Handicrafts, Technology"
                  value={formData.industry}
                  onChangeText={(text) => updateFormData('industry', text)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Target Audience</Text>
                <TextInput
                  className="border border-input bg-background px-4 py-3 rounded-lg text-foreground"
                  placeholder="e.g., Tourists, Small Businesses"
                  value={formData.targetAudience}
                  onChangeText={(text) => updateFormData('targetAudience', text)}
                />
              </View>
              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Generating...' : 'Generate Plan'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text className="text-lg font-bold text-primary mb-4">Your Generated Business Plan</Text>
              <Text className="text-foreground leading-relaxed">{generatedPlan}</Text>
              <TouchableOpacity
                className="bg-secondary py-3 px-8 rounded-lg mt-6 self-center"
                onPress={() => { setGeneratedPlan(null); }}
              >
                <Text className="text-secondary-foreground font-semibold">Generate Another</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
