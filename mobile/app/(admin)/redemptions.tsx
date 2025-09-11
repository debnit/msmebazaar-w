
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, RedemptionRequest } from '@/services/apiService';
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

export default function AdminRedemptionsScreen() {
    const [requests, setRequests] = useState<RedemptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchRequests = useCallback(async (query: string) => {
        setLoading(true);
        const result = await apiService.getRedemptionRequests(query);
        if (result.success && result.data) {
            setRequests(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch redemption requests.');
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
    
    const handleStatusChange = (request: RedemptionRequest, newStatus: string) => {
        if (request.status === newStatus || request.status !== 'Pending') return;

        setUpdatingId(request.id);
        apiService.updateRedemptionStatus(request.id, newStatus).then(result => {
            if(result.success) {
                onRefresh();
                Alert.alert('Success', `Request marked as ${newStatus}.`);
            } else {
                Alert.alert('Error', result.error || 'Failed to update status.');
            }
            setUpdatingId(null);
        })
    };

    const showStatusOptions = (request: RedemptionRequest) => {
        if (request.status !== 'Pending') {
            Alert.alert('Status Locked', 'This request has already been processed.');
            return;
        }

        Alert.alert(
            'Update Status',
            `Update redemption for ${request.user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Mark as Completed', onPress: () => handleStatusChange(request, 'Completed') },
                { text: 'Mark as Failed', onPress: () => handleStatusChange(request, 'Failed'), style: 'destructive' },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        if (status === 'Completed') return 'bg-green-100 text-green-800';
        if (status === 'Failed') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };
    

    return (
        <SafeAreaView className="flex-1 bg-background">
             <View className="p-6 pb-2">
                 <Text className="text-2xl font-bold text-primary mb-4">Manage Redemptions</Text>
                <View className="flex-row items-center bg-card border border-border rounded-lg px-3 mb-4">
                    <Search size={20} color="#6b7280" />
                    <TextInput 
                        placeholder='Search by name, email, or method...'
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
                        <Text className="text-center text-muted-foreground mt-10">No redemption requests found.</Text>
                    ) : (
                        <View className="space-y-4">
                            {requests.map(req => (
                                <View key={req.id} className="bg-card p-4 rounded-lg shadow">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View>
                                            <Text className="font-bold text-foreground">{req.user.name}</Text>
                                            <Text className="text-sm text-muted-foreground">{req.user.email}</Text>
                                        </View>
                                        <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </Text>
                                    </View>
                                    <Text className="text-lg font-semibold text-accent my-1">₹{req.amount.toLocaleString()}</Text>
                                    <View className='my-2'>
                                        <Text className='font-semibold text-foreground'>{req.method}</Text>
                                        <Text className="text-muted-foreground font-mono">{req.details}</Text>
                                    </View>
                                    {req.status === 'Pending' && (
                                        <TouchableOpacity 
                                            className="bg-secondary p-2 rounded-md self-start"
                                            onPress={() => showStatusOptions(req)}
                                            disabled={updatingId === req.id}
                                        >
                                            {updatingId === req.id ? (
                                                <ActivityIndicator color="#1e2a4a" />
                                            ) : (
                                                <Text className="text-secondary-foreground text-sm font-semibold">Update Status</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

