
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Enquiry } from '@/services/apiService';
import { useFocusEffect } from 'expo-router';
import { Search } from 'lucide-react-native';

type DateFilter = 'all' | 'today' | '7d' | '30d';

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


export default function AdminEnquiriesScreen() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchEnquiries = useCallback(async (query: string, filter: DateFilter) => {
        setLoading(true);
        const result = await apiService.getEnquiries(query, filter);
        if (result.success && result.data) {
            setEnquiries(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch enquiries.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEnquiries(debouncedSearchQuery, dateFilter);
    }, [debouncedSearchQuery, dateFilter, fetchEnquiries]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEnquiries(debouncedSearchQuery, dateFilter).then(() => setRefreshing(false));
    }, [debouncedSearchQuery, dateFilter, fetchEnquiries]);

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


    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-6 pb-2">
                 <Text className="text-2xl font-bold text-primary mb-4">Manage Enquiries</Text>
                <View className="flex-row items-center bg-card border border-border rounded-lg px-3 mb-4">
                    <Search size={20} color="#6b7280" />
                    <TextInput 
                        placeholder='Search by name, email, or subject...'
                        className='flex-1 p-3 text-foreground'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View className="flex-row justify-around mb-4">
                    <TouchableOpacity onPress={() => setDateFilter('all')} className={`px-4 py-2 rounded-full ${dateFilter === 'all' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={dateFilter === 'all' ? 'text-primary-foreground' : 'text-secondary-foreground'}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDateFilter('today')} className={`px-4 py-2 rounded-full ${dateFilter === 'today' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={dateFilter === 'today' ? 'text-primary-foreground' : 'text-secondary-foreground'}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDateFilter('7d')} className={`px-4 py-2 rounded-full ${dateFilter === '7d' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={dateFilter === '7d' ? 'text-primary-foreground' : 'text-secondary-foreground'}>7 Days</Text>
                    </TouchableOpacity>
                     <TouchableOpacity onPress={() => setDateFilter('30d')} className={`px-4 py-2 rounded-full ${dateFilter === '30d' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={dateFilter === '30d' ? 'text-primary-foreground' : 'text-secondary-foreground'}>30 Days</Text>
                    </TouchableOpacity>
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
            )}
        </SafeAreaView>
    );
}
