
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, NavArambhRequest } from '@/services/apiService';
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

export default function AdminNavArambhScreen() {
    const [requests, setRequests] = useState<NavArambhRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchRequests = useCallback(async (query: string) => {
        setLoading(true);
        const result = await apiService.getNavArambhRequests(query);
        if (result.success && result.data) {
            setRequests(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch NavArambh requests.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchRequests(debouncedSearchQuery);
    }, [debouncedSearchQuery, fetchRequests]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRequests(debouncedSearchQuery).then(() => setRefreshing(false));
    }, [debouncedSearchQuery, fetchRequests]);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-6 pb-2">
                <Text className="text-2xl font-bold text-primary mb-4">NavArambh Requests</Text>
                <View className="flex-row items-center bg-card border border-border rounded-lg px-3 mb-4">
                    <Search size={20} color="#6b7280" />
                    <TextInput 
                        placeholder='Search by user name or email...'
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
                    {requests.length === 0 ? (
                        <Text className="text-center text-muted-foreground mt-10">No NavArambh requests found.</Text>
                    ) : (
                        <View className="space-y-4">
                            {requests.map(req => (
                                <View key={req.id} className="bg-card p-4 rounded-lg shadow">
                                    <View className="mb-2">
                                        <Text className="font-bold text-foreground">{req.user.name}</Text>
                                        <Text className="text-sm text-muted-foreground">{req.user.email}</Text>
                                        <Text className="text-sm text-muted-foreground">{req.contactDetails}</Text>
                                    </View>
                                    <View className="border-t border-border mt-2 pt-2 space-y-3">
                                        <View>
                                            <Text className="font-semibold text-primary">Asset Details:</Text>
                                            <Text className="text-muted-foreground">{req.assetDetails}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-semibold text-primary">Turnover Details:</Text>
                                            <Text className="text-muted-foreground">{req.turnoverDetails}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-semibold text-primary">Loan Details:</Text>
                                            <Text className="text-muted-foreground">{req.loanDetails}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-semibold text-primary">Problem Details:</Text>
                                            <Text className="text-muted-foreground">{req.problemDetails}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
