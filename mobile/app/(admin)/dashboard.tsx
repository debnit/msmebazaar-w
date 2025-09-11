
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Briefcase, FileText, IndianRupee, Users, BarChart2 } from 'lucide-react-native';
import { AdminDashboardData, apiService } from '@/services/apiService';
import { router } from 'expo-router';

const StatCard = ({ title, value, icon, onPress }: { title: string; value: string; icon: React.ReactNode, onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress} className="bg-card rounded-lg p-4 flex-1 items-center justify-center space-y-2 shadow">
        {icon}
        <Text className="text-muted-foreground text-sm">{title}</Text>
        <Text className="text-2xl font-bold text-primary">{value}</Text>
    </TouchableOpacity>
);

const SimpleBarChart = ({ data, title }: { data: { label: string; value: number }[], title: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <View className="bg-card rounded-lg p-4 mt-6 shadow">
      <Text className="text-lg font-semibold text-primary mb-4">{title}</Text>
      {data.length > 0 ? (
        <View className="space-y-4">
          {data.map((item, index) => (
            <View key={index}>
              <Text className="text-sm text-muted-foreground">{item.label}</Text>
              <View className="flex-row items-center mt-1">
                <View style={{ width: `${(item.value / maxValue) * 100}%` }} className="bg-accent h-4 rounded-l-md" />
                <Text className="text-xs font-semibold text-primary ml-2">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : <Text className="text-muted-foreground">No data available.</Text>}
    </View>
  );
};

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
                        <StatCard title="Total Revenue" value={`₹${(data.totalRevenue/1000).toFixed(0)}k`} icon={<IndianRupee size={24} color="#1e2a4a" />} onPress={() => router.push('/(admin)/payments')} />
                        <StatCard title="Total Users" value={String(data.totalUsers)} icon={<Users size={24} color="#1e2a4a" />} onPress={() => router.push('/(admin)/users')} />
                    </View>
                     <View className="flex-row space-x-4">
                        <StatCard title="Loan Apps" value={String(data.totalLoans)} icon={<Briefcase size={24} color="#1e2a4a" />} onPress={() => router.push('/(admin)/loans')} />
                        <StatCard title="Enquiries" value={String(data.totalEnquiries)} icon={<FileText size={24} color="#1e2a4a" />} onPress={() => router.push('/(admin)/enquiries')} />
                    </View>
                </View>

                {/* Charts */}
                <SimpleBarChart data={data.monthlyRevenue} title="Monthly Revenue (Last 6 Months)" />
                <SimpleBarChart data={data.userSignups} title="User Signups (Last 6 Months)" />

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
