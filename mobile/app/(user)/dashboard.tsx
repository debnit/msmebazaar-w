import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { apiService, DashboardData } from '@/services/apiService';
import { User, LogOut, CreditCard, FileText, MessageSquare } from 'lucide-react-native';

const TabButton = ({ active, label, icon: Icon, onPress }: any) => (
  <TouchableOpacity
    className={`flex-1 py-3 px-2 rounded-md ${active ? 'bg-card' : ''}`}
    onPress={onPress}
  >
    <View className="flex-row items-center justify-center">
      <Icon size={16} color={active ? '#1e2a4a' : '#6b7280'} />
      <Text className={`ml-2 text-xs font-medium ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'enquiries' | 'loans' | 'payments'>('profile');
  const { user, logout } = useAuthStore();

  const fetchDashboardData = async () => {
    setLoading(true);
    const result = await apiService.getDashboardData();
    if (result.success && result.data) {
      setData(result.data);
    } else {
      Alert.alert('Error', result.error || 'Failed to load dashboard data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().then(() => setRefreshing(false));
  }, []);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (loading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#1e2a4a" />
        <Text className="text-muted-foreground mt-4">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <Text className="text-muted-foreground text-center">Failed to load dashboard data.</Text>
        <TouchableOpacity 
          className="bg-primary py-3 px-6 rounded-lg mt-4"
          onPress={fetchDashboardData}
        >
          <Text className="text-primary-foreground font-semibold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <View className="bg-card p-6 rounded-lg">
            <View className="space-y-4">
              <View className="flex-row justify-between items-center"><Text className="font-semibold text-foreground">Name:</Text><Text className="text-muted-foreground">{data.user.name}</Text></View>
              <View className="flex-row justify-between items-center"><Text className="font-semibold text-foreground">Email:</Text><Text className="text-muted-foreground">{data.user.email}</Text></View>
            </View>
          </View>
        );

      case 'enquiries':
        return data.enquiries.length > 0 ? (
          <View className="space-y-4">
            {data.enquiries.map((enquiry) => (
              <View key={enquiry.id} className="bg-card border border-border p-4 rounded-lg">
                 <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold text-primary">#{enquiry.id.substring(0, 8)}</Text>
                    <View className={`px-3 py-1 rounded-full ${ enquiry.status === 'Closed' ? 'bg-green-100' : 'bg-gray-100' }`}>
                      <Text className={`text-sm ${ enquiry.status === 'Closed' ? 'text-green-800' : 'text-gray-800' }`}>{enquiry.status}</Text>
                    </View>
                  </View>
                  <Text className="text-muted-foreground mb-1">{enquiry.subject}</Text>
                  <Text className="text-sm text-muted-foreground">{new Date(enquiry.date).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        ) : <Text className="text-muted-foreground text-center py-8">No enquiries found.</Text>;

      case 'loans':
        return data.loanApplications.length > 0 ? (
          <View className="space-y-4">
            {data.loanApplications.map((loan) => (
              <View key={loan.id} className="bg-card border border-border p-4 rounded-lg">
                 <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-semibold text-primary">#{loan.id.substring(0, 8)}</Text>
                  <View className={`px-3 py-1 rounded-full ${ loan.status === 'Approved' ? 'bg-green-100' : loan.status === 'Rejected' ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <Text className={`text-sm ${ loan.status === 'Approved' ? 'text-green-800' : loan.status === 'Rejected' ? 'text-red-800' : 'text-gray-800'}`}>{loan.status}</Text>
                  </View>
                </View>
                <Text className="text-lg font-semibold mb-1">₹{loan.amount}</Text>
                <Text className="text-sm text-muted-foreground">{new Date(loan.date).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        ) : <Text className="text-muted-foreground text-center py-8">No loan applications found.</Text>;

      case 'payments':
        return data.paymentTransactions.length > 0 ? (
          <View className="space-y-4">
            {data.paymentTransactions.map((payment) => (
              <View key={payment.id} className="bg-card border border-border p-4 rounded-lg">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-semibold text-primary">#{payment.id.substring(0, 8)}</Text>
                  <View className={`px-3 py-1 rounded-full ${ payment.status === 'Success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text className={`text-sm ${ payment.status === 'Success' ? 'text-green-800' : 'text-red-800'}`}>{payment.status}</Text>
                  </View>
                </View>
                <Text className="text-lg font-semibold mb-1">{payment.service}</Text>
                <Text className="text-lg font-semibold mb-1">₹{payment.amount}</Text>
                <Text className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        ) : <Text className="text-muted-foreground text-center py-8">No payments found.</Text>;
      default: return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1e2a4a"]}/>}
      >
        <View className="px-6 py-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-3xl font-bold text-primary">Dashboard</Text>
              <Text className="text-muted-foreground">Welcome back, {data.user.name}!</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <LogOut size={24} color="#1e2a4a" />
            </TouchableOpacity>
          </View>

          <View className="flex-row bg-secondary rounded-lg p-1 mb-6">
            <TabButton active={activeTab === 'profile'} label="Profile" icon={User} onPress={() => setActiveTab('profile')} />
            <TabButton active={activeTab === 'enquiries'} label="Enquiries" icon={MessageSquare} onPress={() => setActiveTab('enquiries')} />
            <TabButton active={activeTab === 'loans'} label="Loans" icon={FileText} onPress={() => setActiveTab('loans')} />
            <TabButton active={activeTab === 'payments'} label="Payments" icon={CreditCard} onPress={() => setActiveTab('payments')} />
          </View>
          
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
