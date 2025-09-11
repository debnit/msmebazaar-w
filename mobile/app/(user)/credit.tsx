
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '@/services/apiService';
import { Gauge, TrendingUp } from 'lucide-react-native';

export default function CreditScoreScreen() {
  const [pan, setPan] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      Alert.alert('Invalid PAN', 'Please enter a valid PAN card number.');
      return;
    }

    setLoading(true);
    setScore(null);
    const result = await apiService.getCreditScore(pan);
    setLoading(false);

    if (result.success && result.score) {
      setScore(result.score);
    } else {
      Alert.alert('Error', result.error || 'Failed to fetch your credit score.');
    }
  };
  
  const getScoreColor = (s: number) => {
    if (s > 750) return 'text-green-600';
    if (s > 650) return 'text-orange-500';
    return 'text-red-600';
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center p-6">
        <View className="bg-card p-6 rounded-lg shadow-sm">
          <View className="mb-6 items-center">
            <Gauge size={32} color="#1e2a4a" />
            <Text className="text-2xl font-bold text-primary mt-2">Instant CIBIL Score Check</Text>
            <Text className="text-muted-foreground text-center mt-1">
              Enter your PAN to get a real-time, comprehensive credit score analysis.
            </Text>
          </View>

          {score === null ? (
            <View className="space-y-6">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">PAN Card Number</Text>
                <TextInput
                  className="border border-input bg-background px-4 py-3 rounded-lg text-foreground text-center text-lg tracking-widest"
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChangeText={(text: string) => setPan(text.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={10}
                />
              </View>
              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${loading ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#ffffff" /> : <TrendingUp size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {loading ? 'Analyzing...' : 'Get My Score'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center space-y-4">
              <Text className="text-muted-foreground">Your Estimated CIBIL Score</Text>
              <Text className={`text-7xl font-bold ${getScoreColor(score)}`}>{score}</Text>
              <Text className={`text-xl font-semibold ${getScoreColor(score)}`}>
                 {score > 750 ? "Excellent" : score > 650 ? "Good" : "Needs Improvement"}
              </Text>
              <Text className="text-muted-foreground text-center mt-2 px-4">
                This score is an estimate and may vary from the official CIBIL report.
              </Text>
              <TouchableOpacity
                className="bg-secondary py-3 px-8 rounded-lg mt-4"
                onPress={() => { setScore(null); setPan(''); }}
              >
                <Text className="text-secondary-foreground font-semibold">Check Again</Text>
              </TouchableOpacity>
            </View>
          )}
          
           <Text className="text-xs text-muted-foreground text-center mt-6">
             By submitting, you consent to MSMEConnect fetching your credit report from CIBIL.
           </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
