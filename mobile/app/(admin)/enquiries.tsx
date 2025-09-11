import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Enquiry } from '@/services/apiService';

export default function AdminEnquiriesScreen() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchEnquiries = async () => {
        const result = await apiService.getEnquiries();
        if (result.success && result.data) {
            setEnquiries(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch enquiries.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEnquiries().then(() => setRefreshing(false));
    }, []);

    const handleStatusChange = (enquiry: Enquiry, newStatus: string) => {
        if (enquiry.status === newStatus) return;
        setUpdatingId(enquiry.id);
        apiService.updateEnquiryStatus(enquiry.id, newStatus).then(result => {
            if (result.success) {
                onRefresh();
                 Alert.alert('Success', `Enquiry status updated to ${newStatus}`);
            } else {
                Alert.alert('Error', result.error || 'Failed to update status.');
            }
            setUpdatingId(null);
        });
    };
    
    const showStatusOptions = (enquiry: Enquiry) => {
        Alert.alert(
            'Update Status',
            `Change status for enquiry from ${enquiry.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Set to Pending', onPress: () => handleStatusChange(enquiry, 'Pending') },
                { text: 'Set In Progress', onPress: () => handleStatusChange(enquiry, 'In Progress') },
                { text: 'Close Enquiry', onPress: () => handleStatusChange(enquiry, 'Closed'), style: 'destructive' },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        if (status === 'Closed') return 'bg-green-100 text-green-800';
        if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    }

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
                <Text className="text-2xl font-bold text-primary mb-6">Manage Enquiries</Text>
                {enquiries.length === 0 ? (
                    <Text className="text-center text-muted-foreground mt-10">No enquiries found.</Text>
                ) : (
                    <View className="space-y-4">
                        {enquiries.map(enquiry => (
                            <View key={enquiry.id} className="bg-card p-4 rounded-lg shadow">
                                <View className="flex-row justify-between items-center mb-2">
                                    <View>
                                        <Text className="font-bold text-foreground">{enquiry.name}</Text>
                                        <Text className="text-sm text-muted-foreground">{enquiry.email}</Text>
                                    </View>
                                    <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(enquiry.status)}`}>
                                        {enquiry.status}
                                    </Text>
                                </View>
                                <Text className="text-foreground my-2 font-semibold">{enquiry.subject}</Text>
                                <Text className="text-muted-foreground mb-4">{enquiry.message}</Text>
                                <TouchableOpacity 
                                    className="bg-secondary p-2 rounded-md self-start"
                                    onPress={() => showStatusOptions(enquiry)}
                                    disabled={updatingId === enquiry.id}
                                >
                                    {updatingId === enquiry.id ? (
                                        <ActivityIndicator color="#1e2a4a" />
                                    ) : (
                                        <Text className="text-secondary-foreground text-sm font-semibold">Update Status</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
