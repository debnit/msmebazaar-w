import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Payment } from '@/services/apiService';
import { Search } from 'lucide-react-native';

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function AdminPaymentsScreen() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchPayments = useCallback(async (query: string) => {
        setLoading(true);
        const result = await apiService.getPayments(query);
        if (result.success && result.data) {
            setPayments(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch payments.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPayments(debouncedSearchQuery);
    }, [debouncedSearchQuery, fetchPayments]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPayments(debouncedSearchQuery).then(() => setRefreshing(false));
    }, [debouncedSearchQuery, fetchPayments]);

    const getStatusColor = (status: string) => {
        if (status === 'Success') return 'bg-green-100 text-green-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-6 pb-2">
                <Text className="text-2xl font-bold text-primary mb-4">Payment Transactions</Text>
                <View className="flex-row items-center bg-card border border-border rounded-lg px-3 mb-4">
                    <Search size={20} color="#6b7280" />
                    <TextInput 
                        placeholder='Search by name, email, service, or ID...'
                        className='flex-1 p-3 text-foreground'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1e2a4a" />
                </View>
            ) : (
                <ScrollView 
                    className="p-6 pt-0"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1e2a4a"]} />}
                >
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
            )}
        </SafeAreaView>
    );
}
