import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Payment } from '@/services/apiService';

export default function AdminPaymentsScreen() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPayments = async () => {
        const result = await apiService.getPayments();
        if (result.success && result.data) {
            setPayments(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch payments.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPayments().then(() => setRefreshing(false));
    }, []);

    const getStatusColor = (status: string) => {
        if (status === 'Success') return 'bg-green-100 text-green-800';
        return 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#1e2a4a" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView 
                className="p-6"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1e2a4a"]} />}
            >
                <Text className="text-2xl font-bold text-primary mb-6">Payment Transactions</Text>
                {payments.length === 0 ? (
                    <Text className="text-center text-muted-foreground mt-10">No payments found.</Text>
                ) : (
                    <View className="space-y-4">
                        {payments.map(payment => (
                            <View key={payment.id} className="bg-card p-4 rounded-lg shadow">
                                <View className="flex-row justify-between items-center mb-2">
                                    <View>
                                      <Text className="font-bold text-foreground">{payment.user.name}</Text>
                                      <Text className="text-sm text-muted-foreground">{payment.user.email}</Text>
                                    </View>
                                    <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                                        {payment.status}
                                    </Text>
                                </View>
                                <Text className="text-muted-foreground">{payment.serviceName}</Text>
                                <Text className="text-lg font-semibold text-accent">₹{payment.amount.toLocaleString()}</Text>
                                <Text className="text-xs text-muted-foreground mt-2">ID: {payment.razorpayPaymentId}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
