import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const loans = [
    { id: '1', userName: 'Rohan Sharma', amount: '50,000', status: 'Pending', purpose: 'Working Capital' },
    { id: '2', userName: 'Priya Patel', amount: '1,20,000', status: 'Approved', purpose: 'Business Expansion' },
    { id: '3', userName: 'Vikram Singh', amount: '75,000', status: 'Rejected', purpose: 'Equipment Purchase' },
];

export default function AdminLoansScreen() {
    const handleStatusChange = (id: string, currentStatus: string) => {
        Alert.alert(
            'Update Loan Status',
            `Update loan #${id.substring(0,6)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => console.log('Approve loan') },
                { text: 'Reject', onPress: () => console.log('Reject loan'), style: 'destructive' },
                { text: 'Set to Pending', onPress: () => console.log('Set to pending') },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        if (status === 'Approved') return 'bg-green-100 text-green-800';
        if (status === 'Rejected') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="p-6">
                <Text className="text-2xl font-bold text-primary mb-6">Manage Loan Applications</Text>
                <View className="space-y-4">
                    {loans.map(loan => (
                        <View key={loan.id} className="bg-card p-4 rounded-lg shadow">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="font-bold text-foreground">{loan.userName}</Text>
                                <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(loan.status)}`}>
                                    {loan.status}
                                </Text>
                            </View>
                            <Text className="text-lg font-semibold text-accent mb-1">₹{loan.amount}</Text>
                            <Text className="text-muted-foreground mb-4">{loan.purpose}</Text>
                            <TouchableOpacity 
                                className="bg-secondary p-2 rounded-md self-start"
                                onPress={() => handleStatusChange(loan.id, loan.status)}
                            >
                                <Text className="text-secondary-foreground text-sm font-semibold">Update Status</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
