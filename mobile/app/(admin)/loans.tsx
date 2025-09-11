import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Loan } from '@/services/apiService';

export default function AdminLoansScreen() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchLoans = async () => {
        const result = await apiService.getLoans();
        if (result.success && result.data) {
            setLoans(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch loans.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchLoans().then(() => setRefreshing(false));
    }, []);

    const handleStatusChange = (loan: Loan, newStatus: string) => {
        if (loan.status === newStatus) return;
        setUpdatingId(loan.id);
        apiService.updateLoanStatus(loan.id, newStatus).then(result => {
            if (result.success) {
                onRefresh();
                Alert.alert('Success', `Loan status updated to ${newStatus}`);
            } else {
                Alert.alert('Error', result.error || 'Failed to update status.');
            }
            setUpdatingId(null);
        });
    };

    const showStatusOptions = (loan: Loan) => {
        Alert.alert(
            'Update Loan Status',
            `Update loan for ${loan.user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Approve', onPress: () => handleStatusChange(loan, 'Approved') },
                { text: 'Reject', onPress: () => handleStatusChange(loan, 'Rejected'), style: 'destructive' },
                { text: 'Set to Pending', onPress: () => handleStatusChange(loan, 'Pending') },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        if (status === 'Approved') return 'bg-green-100 text-green-800';
        if (status === 'Rejected') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
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
                <Text className="text-2xl font-bold text-primary mb-6">Manage Loan Applications</Text>
                {loans.length === 0 ? (
                    <Text className="text-center text-muted-foreground mt-10">No loan applications found.</Text>
                ) : (
                    <View className="space-y-4">
                        {loans.map(loan => (
                            <View key={loan.id} className="bg-card p-4 rounded-lg shadow">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="font-bold text-foreground">{loan.user.name}</Text>
                                    <Text className={`font-semibold px-2 py-1 rounded-full text-xs ${getStatusColor(loan.status)}`}>
                                        {loan.status}
                                    </Text>
                                </View>
                                <Text className="text-lg font-semibold text-accent mb-1">₹{loan.loanAmount.toLocaleString()}</Text>
                                <Text className="text-muted-foreground mb-4">{loan.loanPurpose}</Text>
                                <TouchableOpacity 
                                    className="bg-secondary p-2 rounded-md self-start"
                                    onPress={() => showStatusOptions(loan)}
                                    disabled={updatingId === loan.id}
                                >
                                     {updatingId === loan.id ? (
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
