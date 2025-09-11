import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Briefcase, FileText, IndianRupee, Users } from 'lucide-react-native';
import { AdminDashboardData, apiService } from '@/services/apiService';

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <View className="bg-card rounded-lg p-4 flex-1 items-center justify-center space-y-2 shadow">
        {icon}
        <Text className="text-muted-foreground text-sm">{title}</Text>
        <Text className="text-2xl font-bold text-primary">{value}</Text>
    </View>
);

export default function AdminDashboardScreen() {
    const { user, logout } = useAuthStore();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await apiService.getAdminDashboardData();
            if(result.success && result.data) {
                setData(result.data);
            } else {
                Alert.alert("Error", result.error || "Could not fetch dashboard data.");
            }
            setLoading(false);
        };
        fetchData();
    }, []);
    
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#1e2a4a" />
                <Text className="text-muted-foreground mt-4">Loading Admin Dashboard...</Text>
            </SafeAreaView>
        );
    }
    
    if (!data) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <Text className="text-muted-foreground">Failed to load data.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="p-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-3xl font-bold text-primary">Admin</Text>
                        <Text className="text-muted-foreground">Welcome, {user?.name}!</Text>
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <LogOut size={24} color="#1e2a4a" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View className="space-y-4">
                    <View className="flex-row space-x-4">
                        <StatCard title="Total Revenue" value={`₹${(data.totalRevenue/1000).toFixed(0)}k`} icon={<IndianRupee size={24} color="#1e2a4a" />} />
                        <StatCard title="Total Users" value={String(data.totalUsers)} icon={<Users size={24} color="#1e2a4a" />} />
                    </View>
                     <View className="flex-row space-x-4">
                        <StatCard title="Loan Apps" value={String(data.totalLoans)} icon={<Briefcase size={24} color="#1e2a4a" />} />
                        <StatCard title="Enquiries" value={String(data.totalEnquiries)} icon={<FileText size={24} color="#1e2a4a" />} />
                    </View>
                </View>

                {/* Recent Loans */}
                <View className="bg-card rounded-lg p-4 mt-6 shadow">
                    <Text className="text-lg font-semibold text-primary mb-4">Recent Loan Applications</Text>
                    {data.recentLoans.length > 0 ? (
                        <View className="space-y-3">
                            {data.recentLoans.map(loan => (
                                <View key={loan.id} className="flex-row justify-between items-center">
                                    <View>
                                        <Text className="font-semibold text-foreground">{loan.user.name}</Text>
                                        <Text className="text-muted-foreground">₹{loan.loanAmount.toLocaleString()}</Text>
                                    </View>
                                    <Text className={`font-bold ${loan.status === 'Approved' ? 'text-green-600' : 'text-orange-500'}`}>{loan.status}</Text>
                                </View>
                            ))}
                        </View>
                    ) : <Text className="text-muted-foreground">No recent loan applications.</Text>}
                </View>

                {/* Recent Users */}
                 <View className="bg-card rounded-lg p-4 mt-6 shadow">
                    <Text className="text-lg font-semibold text-primary mb-4">Recent Sign Ups</Text>
                     {data.recentUsers.length > 0 ? (
                        <View className="space-y-3">
                            {data.recentUsers.map(u => (
                                <View key={u.id}>
                                    <Text className="font-semibold text-foreground">{u.name}</Text>
                                    <Text className="text-muted-foreground">{u.email}</Text>
                                </View>
                            ))}
                        </View>
                     ): <Text className="text-muted-foreground">No recent users.</Text>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
