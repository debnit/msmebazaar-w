import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// This data should come from an API
const enquiries = [
    { id: '1', name: 'Anil Kumar', email: 'anil@example.com', subject: 'Loan Enquiry', status: 'Pending' },
    { id: '2', name: 'Sunita Devi', email: 'sunita@example.com', subject: 'Payment Gateway', status: 'Closed' },
];

export default function AdminEnquiriesScreen() {

    const handleStatusChange = (id: string, currentStatus: string) => {
        Alert.alert(
            'Update Status',
            `Change status for enquiry #${id.substring(0,6)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                // In a real app, you would have options for each status
                { text: 'Close', onPress: () => console.log('Close enquiry'), style: 'destructive' },
                { text: 'Set to Pending', onPress: () => console.log('Set to pending') },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="p-6">
                <Text className="text-2xl font-bold text-primary mb-6">Manage Enquiries</Text>
                <View className="space-y-4">
                    {enquiries.map(enquiry => (
                        <View key={enquiry.id} className="bg-card p-4 rounded-lg shadow">
                            <View className="flex-row justify-between items-center mb-2">
                                <View>
                                    <Text className="font-bold text-foreground">{enquiry.name}</Text>
                                    <Text className="text-sm text-muted-foreground">{enquiry.email}</Text>
                                </View>
                                <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${enquiry.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {enquiry.status}
                                </Text>
                            </View>
                            <Text className="text-foreground my-2">{enquiry.subject}</Text>
                            <TouchableOpacity 
                                className="bg-secondary p-2 rounded-md self-start"
                                onPress={() => handleStatusChange(enquiry.id, enquiry.status)}
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
