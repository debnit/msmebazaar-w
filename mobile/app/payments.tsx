import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaymentStore, PaymentService } from '@/store/paymentStore';
import { paymentService } from '@/services/paymentService';
import { CreditCard, CheckCircle } from 'lucide-react-native';

export default function PaymentsScreen() {
  const { services, selectedService, customAmount, setSelectedService, setCustomAmount, resetPayment } = usePaymentStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleServicePayment = async (service: PaymentService) => {
    setIsProcessing(true);
    try {
      const result = await paymentService.initiatePayment({
        amount: service.price * 100, // Convert to paise
        serviceName: service.name,
        description: service.description,
      });

      if (result.success) {
        Alert.alert(
          'Payment Successful',
          `Your payment for ${service.name} has been processed successfully.`,
          [{ text: 'OK', onPress: () => resetPayment() }]
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Payment could not be processed');
      }
    } catch (error) {
      Alert.alert('Payment Failed', 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomPayment = async () => {
    if (customAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await paymentService.initiatePayment({
        amount: customAmount * 100, // Convert to paise
        serviceName: 'Custom Payment',
        description: 'Custom payment amount',
      });

      if (result.success) {
        Alert.alert(
          'Payment Successful',
          `Your payment of ₹${customAmount} has been processed successfully.`,
          [{ text: 'OK', onPress: () => resetPayment() }]
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Payment could not be processed');
      }
    } catch (error) {
      Alert.alert('Payment Failed', 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        <View className="py-6">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-primary mb-2">Payment Services</Text>
            <Text className="text-muted-foreground">
              Choose from our premium services or make a custom payment.
            </Text>
          </View>

          {/* Service Cards */}
          <View className="space-y-4 mb-8">
            {services.map((service) => (
              <View key={service.id} className="bg-card p-6 rounded-lg border border-border">
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-xl font-semibold text-primary mb-2">
                      {service.name}
                    </Text>
                    <Text className="text-muted-foreground mb-4">
                      {service.description}
                    </Text>
                    <Text className="text-2xl font-bold text-accent">
                      ₹{service.price}
                    </Text>
                  </View>
                  <View className="ml-4">
                    <CreditCard size={24} color="#1e2a4a" />
                  </View>
                </View>
                <TouchableOpacity
                  className={`py-3 px-6 rounded-lg ${
                    isProcessing ? 'bg-muted' : 'bg-primary'
                  }`}
                  onPress={() => handleServicePayment(service)}
                  disabled={isProcessing}
                >
                  <Text className="text-primary-foreground text-center font-semibold">
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Custom Payment Section */}
          <View className="bg-card p-6 rounded-lg border border-border">
            <View className="mb-6">
              <Text className="text-xl font-semibold text-primary mb-2">
                Custom Payment
              </Text>
              <Text className="text-muted-foreground">
                Enter a custom amount for any other service or payment.
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-foreground mb-2">
                Amount (₹)
              </Text>
              <TextInput
                className="border border-input bg-background px-4 py-3 rounded-lg text-foreground text-lg"
                placeholder="Enter amount"
                value={customAmount > 0 ? customAmount.toString() : ''}
                onChangeText={(text) => {
                  const amount = parseFloat(text) || 0;
                  setCustomAmount(amount);
                }}
                keyboardType="numeric"
                placeholderTextColor="#6b7280"
              />
            </View>

            <TouchableOpacity
              className={`py-3 px-6 rounded-lg ${
                isProcessing || customAmount <= 0 ? 'bg-muted' : 'bg-accent'
              }`}
              onPress={handleCustomPayment}
              disabled={isProcessing || customAmount <= 0}
            >
              <Text className="text-accent-foreground text-center font-semibold">
                {isProcessing ? 'Processing...' : `Pay ₹${customAmount || 0}`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment Info */}
          <View className="mt-8 bg-secondary p-4 rounded-lg">
            <View className="flex-row items-center mb-2">
              <CheckCircle size={20} color="#10b981" />
              <Text className="ml-2 font-semibold text-foreground">Secure Payment</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              All payments are processed securely through Razorpay. Your payment information is encrypted and protected.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
