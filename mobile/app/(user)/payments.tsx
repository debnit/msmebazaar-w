
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaymentStore } from '@/store/paymentStore';
import { paymentService } from '@/services/paymentService';
import { CreditCard, CheckCircle, Star, BarChart, Route, Wallet, Check, Wrench, Megaphone } from 'lucide-react-native';
import { apiService } from '@/services/apiService';
import { router } from 'expo-router';

const serviceIcons: { [key: string]: React.ReactNode } = {
  "Pro-Membership": <Star size={32} color="#1e2a4a" />,
  "Valuation Service": <BarChart size={32} color="#1e2a4a" />,
  "Exit Strategy (NavArambh)": <Route size={32} color="#1e2a4a" />,
  "Plant and Machinery": <Wrench size={32} color="#1e2a4a" />,
  "Advertise Your Business": <Megaphone size={32} color="#1e2a4a" />,
};

export default function PaymentsScreen() {
  const { services, customAmount, setCustomAmount, resetPayment } = usePaymentStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await apiService.getDashboardData();
      if(res.success && res.data) {
        setWalletBalance(res.data.user.walletBalance);
      }
    }
    fetchBalance();
  }, [])
  

  const handlePayment = async (serviceName: string, amount: number, description?: string) => {
    setProcessingId(serviceName);
    setIsProcessing(true);
    try {
      const result = await paymentService.initiatePayment({ amount, serviceName, description });
      if (result.success) {
        if(serviceName !== "Pro-Membership" && serviceName !== "Valuation Service" && serviceName !== "Exit Strategy (NavArambh)" && serviceName !== "Plant and Machinery" && serviceName !== "Advertise Your Business") {
            Alert.alert('Payment Successful', `Your payment for ${serviceName} was successful.`,
              [{ text: 'OK', onPress: resetPayment }]
            );
        }
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

  const handlePayWithWallet = async (serviceName: string, amount: number) => {
    setProcessingId(serviceName);
    setIsProcessing(true);
    try {
      const result = await paymentService.payWithWallet({ serviceName, amount });
       if (result.success) {
         if(serviceName !== "Pro-Membership" && serviceName !== "Valuation Service" && serviceName !== "Exit Strategy (NavArambh)" && serviceName !== "Plant and Machinery" && serviceName !== "Advertise Your Business") {
            Alert.alert('Payment Successful', `Paid for ${serviceName} using your wallet balance.`);
         }
        setWalletBalance(prev => (prev !== null ? prev - amount : null));
      } else {
        Alert.alert('Payment Failed', result.error || 'Could not process wallet payment.');
      }
    } catch (error) {
       Alert.alert('Payment Failed', 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  }

  const handleCustomPayment = async () => {
    if (customAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (walletBalance !== null && customAmount <= walletBalance) {
      handlePayWithWallet('Custom Payment', customAmount);
    } else {
      handlePayment('Custom Payment', customAmount, 'Custom payment amount');
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary mb-2">Our Premium Services</Text>
          <Text className="text-muted-foreground">Choose a service or make a custom payment to suit your needs.</Text>
        </View>
        
        {walletBalance !== null && (
             <View className="bg-card p-4 rounded-lg shadow-sm mb-6 flex-row items-center space-x-3">
                <Wallet size={24} color="#1e2a4a" />
                <View>
                    <Text className="text-sm text-muted-foreground">Wallet Balance</Text>
                    <Text className="text-2xl font-bold text-primary">₹{walletBalance.toFixed(2)}</Text>
                </View>
            </View>
        )}

        <View className="space-y-4 mb-8">
          {services.map((service) => {
            const canPayWithWallet = walletBalance !== null && walletBalance >= service.price;
            const isProcessingThis = isProcessing && processingId === service.name;

            return (
            <View key={service.id} className="bg-card p-6 rounded-lg border border-border">
              <View className="flex-row items-center gap-4 mb-4">
                 {serviceIcons[service.name] || <CreditCard size={32} color="#1e2a4a" />}
                <View className="flex-1">
                  <Text className="text-xl font-semibold text-primary">{service.name}</Text>
                  <Text className="text-muted-foreground">{service.description}</Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-accent mb-4">₹{service.price}</Text>

                {service.features && (
                    <View className="space-y-2 mb-4">
                        {service.features.map((feature, i) => (
                        <View key={i} className="flex-row items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <Text className="text-sm text-muted-foreground">{feature}</Text>
                        </View>
                        ))}
                    </View>
                )}


              {canPayWithWallet ? (
                 <TouchableOpacity
                  className={`py-3 px-6 rounded-lg flex-row justify-center items-center ${isProcessingThis ? 'bg-muted' : 'bg-primary'}`}
                  onPress={() => handlePayWithWallet(service.name, service.price)}
                  disabled={isProcessing}
                >
                  {isProcessingThis ? <ActivityIndicator color="#1e2a4a" /> : <Wallet color="#fafafa" size={16} />}
                  <Text className="text-primary-foreground text-center font-semibold ml-2">
                    {isProcessingThis ? 'Processing...' : 'Pay with Wallet'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className={`py-3 px-6 rounded-lg flex-row justify-center items-center ${isProcessingThis ? 'bg-muted' : 'bg-primary'}`}
                  onPress={() => handlePayment(service.name, service.price, service.description)}
                  disabled={isProcessing}
                >
                   {isProcessingThis ? <ActivityIndicator color="#1e2a4a" /> : null}
                  <Text className="text-primary-foreground text-center font-semibold ml-2">
                    {isProcessingThis ? 'Processing...' : 'Pay Now'}
                  </Text>
                </TouchableOpacity>
              )}
               {!canPayWithWallet && walletBalance !== null && walletBalance > 0 && (
                  <Text className="text-xs text-red-500 text-center mt-2">Insufficient wallet balance</Text>
               )}
            </View>
          )})}
        </View>

        <View className="bg-card p-6 rounded-lg border border-border">
          <View className="mb-4">
            <Text className="text-xl font-semibold text-primary">Custom Payment</Text>
            <Text className="text-muted-foreground">Paying for a different service? Enter the amount below.</Text>
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
