import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const payments = [
    { id: '1', userName: 'Rohan Sharma', service: 'Pro-Membership', amount: '99', status: 'Success' },
    { id: '2', userName: 'Priya Patel', service: 'Valuation Service', amount: '199', status: 'Success' },
    { id: '3', userName: 'Amit Singh', service: 'Custom Payment', amount: '500', status: 'Failed' },
];

export default function AdminPaymentsScreen() {
    const getStatusColor = (status: string) => {
        if (status === 'Success') return 'bg-green-100 text-green-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="p-6">
                <Text className="text-2xl font-bold text-primary mb-6">Payment Transactions</Text>
                <View className="space-y-4">
                    {payments.map(payment => (
                        <View key={payment.id} className="bg-card p-4 rounded-lg shadow">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="font-bold text-foreground">{payment.userName}</Text>
                                <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                                    {payment.status}
                                </Text>
                            </View>
                            <Text className="text-muted-foreground">{payment.service}</Text>
                            <Text className="text-lg font-semibold text-accent">₹{payment.amount}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
