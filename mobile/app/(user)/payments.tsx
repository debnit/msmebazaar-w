import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaymentStore, PaymentService } from '@/store/paymentStore';
import { paymentService } from '@/services/paymentService';
import { CreditCard, CheckCircle, Star, BarChart, Route } from 'lucide-react-native';

const serviceIcons: { [key: string]: React.ReactNode } = {
  "Pro-Membership": <Star className="h-8 w-8 text-primary" />,
  "Valuation Service": <BarChart className="h-8 w-8 text-primary" />,
  "Exit Strategy (NavArambh)": <Route className="h-8 w-8 text-primary" />,
};

export default function PaymentsScreen() {
  const { services, customAmount, setCustomAmount, resetPayment } = usePaymentStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handlePayment = async (serviceName: string, amount: number, description?: string) => {
    setProcessingId(serviceName);
    setIsProcessing(true);
    try {
      const result = await paymentService.initiatePayment({ amount, serviceName, description });
      if (result.success) {
        Alert.alert('Payment Successful', `Your payment for ${serviceName} was successful.`,
          [{ text: 'OK', onPress: resetPayment }]
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Payment could not be processed');
      }
    } catch (error) {
      Alert.alert('Payment Failed', 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  const handleCustomPayment = async () => {
    if (customAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    handlePayment('Custom Payment', customAmount, 'Custom payment amount');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary mb-2">Payment Services</Text>
          <Text className="text-muted-foreground">Choose from our premium services or make a custom payment.</Text>
        </View>

        <View className="space-y-4 mb-8">
          {services.map((service) => (
            <View key={service.id} className="bg-card p-6 rounded-lg border border-border">
              <View className="flex-row items-center gap-4 mb-4">
                 {serviceIcons[service.name] || <CreditCard size={32} color="#1e2a4a" />}
                <View className="flex-1">
                  <Text className="text-xl font-semibold text-primary">{service.name}</Text>
                  <Text className="text-muted-foreground">{service.description}</Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-accent mb-4">₹{service.price}</Text>
              <TouchableOpacity
                className={`py-3 px-6 rounded-lg flex-row justify-center items-center ${isProcessing && processingId === service.name ? 'bg-muted' : 'bg-primary'}`}
                onPress={() => handlePayment(service.name, service.price, service.description)}
                disabled={isProcessing}
              >
                 {isProcessing && processingId === service.name ? <ActivityIndicator color="#1e2a4a" /> : null}
                <Text className="text-primary-foreground text-center font-semibold ml-2">
                  {isProcessing && processingId === service.name ? 'Processing...' : 'Pay Now'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="bg-card p-6 rounded-lg border border-border">
          <View className="mb-4">
            <Text className="text-xl font-semibold text-primary">Custom Payment</Text>
            <Text className="text-muted-foreground">Enter an amount for any other service.</Text>
          </View>
          <Text className="text-sm font-medium text-foreground mb-2">Amount (₹)</Text>
          <TextInput
            className="border border-input bg-background px-4 py-3 rounded-lg text-foreground text-lg mb-4"
            placeholder="Enter amount"
            value={customAmount > 0 ? customAmount.toString() : ''}
            onChangeText={(text) => setCustomAmount(parseFloat(text) || 0)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            className={`py-3 px-6 rounded-lg flex-row justify-center items-center ${isProcessing || customAmount <= 0 ? 'bg-muted' : 'bg-accent'}`}
            onPress={handleCustomPayment}
            disabled={isProcessing || customAmount <= 0}
          >
            {isProcessing && processingId === 'Custom Payment' ? <ActivityIndicator color="#ffffff" /> : null}
            <Text className="text-accent-foreground text-center font-semibold ml-2">
              {isProcessing && processingId === 'Custom Payment' ? 'Processing...' : `Pay ₹${customAmount || 0}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 bg-secondary p-4 rounded-lg">
          <View className="flex-row items-center mb-2">
            <CheckCircle size={20} color="#10b981" />
            <Text className="ml-2 font-semibold text-foreground">Secure Payments by Razorpay</Text>
          </View>
          <Text className="text-sm text-muted-foreground">Your payment information is encrypted and protected.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
