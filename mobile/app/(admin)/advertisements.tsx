
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, RefreshControl, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Advertisement } from '@/services/apiService';
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

export default function AdminAdvertisementsScreen() {
    const [requests, setRequests] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchRequests = useCallback(async (query: string) => {
        setLoading(true);
        const result = await apiService.getAdvertisements(query);
        if (result.success && result.data) {
            setRequests(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch advertisement requests.');
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
                <Text className="text-2xl font-bold text-primary mb-4">Advertisement Submissions</Text>
                <View className="flex-row items-center bg-card border border-border rounded-lg px-3 mb-4">
                    <Search size={20} color="#6b7280" />
                    <TextInput 
                        placeholder='Search by user or business name...'
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
                        <Text className="text-center text-muted-foreground mt-10">No advertisements found.</Text>
                    ) : (
                        <View className="space-y-4">
                            {requests.map(req => (
                                <View key={req.id} className="bg-card p-4 rounded-lg shadow">
                                    <View className="mb-2">
                                        <Text className="font-bold text-foreground">{req.user.name}</Text>
                                        <Text className="text-sm text-muted-foreground">{req.user.email}</Text>
                                    </View>
                                    <View className="border-t border-border mt-2 pt-2 space-y-3">
                                        <View>
                                            <Text className="font-semibold text-primary">Business Name:</Text>
                                            <Text className="text-muted-foreground">{req.businessName}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-semibold text-primary">Nature of Business:</Text>
                                            <Text className="text-muted-foreground">{req.businessNature}</Text>
                                        </View>
                                         <View>
                                            <Text className="font-semibold text-primary">Photos:</Text>
                                            <Text className="text-muted-foreground">{req.photosUrl || 'Not provided'}</Text>
                                        </View>
                                         <View>
                                            <Text className="font-semibold text-primary">Videos:</Text>
                                            <Text className="text-muted-foreground">{req.videosUrl || 'Not provided'}</Text>
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
