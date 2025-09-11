
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '@/services/apiService';
import { Gift, Send } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';

export default function RedeemScreen() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [method, setMethod] = useState('');
  const [details, setDetails] = useState('');

  const fetchBalance = async () => {
    setLoadingBalance(true);
    const result = await apiService.getDashboardData();
    if(result.success && result.data) {
        setBalance(result.data.user.walletBalance);
    } else {
        Alert.alert('Error', 'Could not fetch wallet balance.');
    }
    setLoadingBalance(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchBalance();
    }, [])
  );
  
  const handleSubmit = async () => {
    if (!method || !details) {
      Alert.alert('Validation Error', 'Please select a method and enter the details.');
      return;
    }
    if (balance === null || balance <= 0) {
      Alert.alert('Error', 'You do not have sufficient balance to redeem.');
      return;
    }

    setIsSubmitting(true);
    const result = await apiService.submitRedemptionRequest({ amount: balance, method, details });
    if (result.success) {
      Alert.alert('Success', 'Your redemption request has been submitted.', [
        { text: 'OK', onPress: () => router.push('/(user)/dashboard') }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to submit your request.');
    }
    setIsSubmitting(false);
  };
  
  const methods = [
    { value: 'UPI', label: 'UPI ID' },
    { value: 'AccountNumber', label: 'Bank Account' },
    { value: 'Mobile', label: 'Mobile (PayTM/PhonePe)' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        <View className="py-6">
          <View className="bg-card p-6 rounded-lg shadow-sm">
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Gift size={24} color="#1e2a4a" />
                <Text className="text-2xl font-bold text-primary ml-2">Redeem Balance</Text>
              </View>
              <Text className="text-muted-foreground">
                Request a payout for your available wallet balance.
              </Text>
            </View>

            <View className="bg-secondary p-4 rounded-lg mb-6">
                <Text className="text-sm text-center text-secondary-foreground">Available to Redeem</Text>
                {loadingBalance ? <ActivityIndicator color="#1e2a4a" /> : 
                <Text className="text-3xl text-center font-bold text-primary">₹{balance?.toFixed(2) ?? '0.00'}</Text>
                }
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Payout Method</Text>
                <View className="border border-input bg-background rounded-md">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="p-2">
                    {methods.map((m) => (
                      <TouchableOpacity
                        key={m.value}
                        className={`px-4 py-2 rounded-full mr-2 ${method === m.value ? 'bg-primary' : 'bg-secondary'}`}
                        onPress={() => setMethod(m.value)}
                      >
                        <Text className={`text-sm ${method === m.value ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {method ? (
                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">
                    {methods.find(m => m.value === method)?.label}
                  </Text>
                  <TextInput
                    className="border border-input bg-background px-3 py-3 rounded-md text-foreground"
                    placeholder={`Enter your ${methods.find(m => m.value === method)?.label}`}
                    value={details}
                    onChangeText={setDetails}
                  />
                </View>
              ) : null}

              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${isSubmitting || loadingBalance || (balance ?? 0) <= 0 ? 'bg-muted' : 'bg-accent'}`}
                onPress={handleSubmit}
                disabled={isSubmitting || loadingBalance || (balance ?? 0) <= 0}
              >
                {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Send size={20} color="#ffffff" />}
                <Text className="text-accent-foreground font-semibold ml-2">
                  {isSubmitting ? 'Submitting...' : `Request Payout of ₹${balance?.toFixed(2) ?? '0.00'}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
