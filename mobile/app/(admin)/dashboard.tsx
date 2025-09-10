import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react-native';

// In a real app, this data would come from an API endpoint similar to the web version.
const adminDashboardData = {
    totalRevenue: 50000,
    totalUsers: 150,
    totalLoans: 45,
    totalEnquiries: 80,
    recentLoans: [
        { id: '1', userName: 'Rohan Sharma', amount: '50,000', status: 'Pending' },
        { id: '2', userName: 'Priya Patel', amount: '1,20,000', status: 'Approved' },
    ],
    recentUsers: [
        { id: '1', name: 'Sanjay Kumar', email: 'sanjay@example.com' },
        { id: '2', name: 'Anjali Mehta', email: 'anjali@example.com' },
    ]
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <View className="bg-card rounded-lg p-4 flex-1 items-center justify-center space-y-2 shadow">
        {icon}
        <Text className="text-muted-foreground text-sm">{title}</Text>
        <Text className="text-2xl font-bold text-primary">{value}</Text>
    </View>
);

export default function AdminDashboardScreen() {
    const { user, logout } = useAuthStore();
    
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
                        <StatCard title="Total Revenue" value={`₹${(adminDashboardData.totalRevenue/1000).toFixed(0)}k`} icon={<Banknote size={24} color="#1e2a4a" />} />
                        <StatCard title="Total Users" value={String(adminDashboardData.totalUsers)} icon={<Users size={24} color="#1e2a4a" />} />
                    </View>
                     <View className="flex-row space-x-4">
                        <StatCard title="Loan Apps" value={String(adminDashboardData.totalLoans)} icon={<Briefcase size={24} color="#1e2a4a" />} />
                        <StatCard title="Enquiries" value={String(adminDashboardData.totalEnquiries)} icon={<FileText size={24} color="#1e2a4a" />} />
                    </View>
                </View>

                {/* Recent Loans */}
                <View className="bg-card rounded-lg p-4 mt-6 shadow">
                    <Text className="text-lg font-semibold text-primary mb-4">Recent Loan Applications</Text>
                    <View className="space-y-3">
                        {adminDashboardData.recentLoans.map(loan => (
                            <View key={loan.id} className="flex-row justify-between items-center">
                                <View>
                                    <Text className="font-semibold text-foreground">{loan.userName}</Text>
                                    <Text className="text-muted-foreground">₹{loan.amount}</Text>
                                </View>
                                <Text className={`font-bold ${loan.status === 'Approved' ? 'text-green-600' : 'text-orange-500'}`}>{loan.status}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Users */}
                 <View className="bg-card rounded-lg p-4 mt-6 shadow">
                    <Text className="text-lg font-semibold text-primary mb-4">Recent Sign Ups</Text>
                    <View className="space-y-3">
                        {adminDashboardData.recentUsers.map(u => (
                            <View key={u.id}>
                                <Text className="font-semibold text-foreground">{u.name}</Text>
                                <Text className="text-muted-foreground">{u.email}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
