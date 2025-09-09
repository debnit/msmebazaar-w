import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { apiService, DashboardData } from '@/services/apiService';
import { User, LogOut, CreditCard, FileText, MessageSquare } from 'lucide-react-native';

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'enquiries' | 'loans' | 'payments'>('profile');
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (loading) {
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
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">Profile Information</Text>
              <Text className="text-muted-foreground">Your personal and contact details.</Text>
            </View>
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text className="font-semibold">Name:</Text>
                <Text>{data.user.name}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold">Email:</Text>
                <Text>{data.user.email}</Text>
              </View>
              <TouchableOpacity className="bg-primary py-3 px-6 rounded-lg mt-4">
                <Text className="text-primary-foreground text-center font-semibold">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'enquiries':
        return (
          <View className="bg-card p-6 rounded-lg">
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">My Enquiries</Text>
              <Text className="text-muted-foreground">A list of your recent enquiries.</Text>
            </View>
            {data.enquiries.length > 0 ? (
              <View className="space-y-4">
                {data.enquiries.map((enquiry) => (
                  <View key={enquiry.id} className="border border-border p-4 rounded-lg">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold">#{enquiry.id.substring(0, 8)}</Text>
                      <View className={`px-3 py-1 rounded-full ${
                        enquiry.status === 'Answered' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Text className={`text-sm ${
                          enquiry.status === 'Answered' ? 'text-green-800' : 'text-gray-800'
                        }`}>
                          {enquiry.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-muted-foreground mb-1">{enquiry.subject}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {new Date(enquiry.date).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-muted-foreground text-center py-8">No enquiries found.</Text>
            )}
          </View>
        );

      case 'loans':
        return (
          <View className="bg-card p-6 rounded-lg">
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">Loan Applications</Text>
              <Text className="text-muted-foreground">Track the status of your loan applications.</Text>
            </View>
            {data.loanApplications.length > 0 ? (
              <View className="space-y-4">
                {data.loanApplications.map((loan) => (
                  <View key={loan.id} className="border border-border p-4 rounded-lg">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold">#{loan.id.substring(0, 8)}</Text>
                      <View className={`px-3 py-1 rounded-full ${
                        loan.status === 'Approved' ? 'bg-green-100' :
                        loan.status === 'Rejected' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <Text className={`text-sm ${
                          loan.status === 'Approved' ? 'text-green-800' :
                          loan.status === 'Rejected' ? 'text-red-800' : 'text-gray-800'
                        }`}>
                          {loan.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-lg font-semibold mb-1">₹{loan.amount}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {new Date(loan.date).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-muted-foreground text-center py-8">No loan applications found.</Text>
            )}
          </View>
        );

      case 'payments':
        return (
          <View className="bg-card p-6 rounded-lg">
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-2">Payment History</Text>
              <Text className="text-muted-foreground">Your history of transactions.</Text>
            </View>
            {data.paymentTransactions.length > 0 ? (
              <View className="space-y-4">
                {data.paymentTransactions.map((payment) => (
                  <View key={payment.id} className="border border-border p-4 rounded-lg">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold">#{payment.id.substring(0, 8)}</Text>
                      <View className={`px-3 py-1 rounded-full ${
                        payment.status === 'Success' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Text className={`text-sm ${
                          payment.status === 'Success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {payment.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-lg font-semibold mb-1">{payment.service}</Text>
                    <Text className="text-lg font-semibold mb-1">₹{payment.amount}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString()}
                    </Text>
                    {payment.status === 'Success' && (
                      <TouchableOpacity className="border border-border py-2 px-4 rounded-lg mt-3">
                        <Text className="text-center font-semibold">Download Receipt</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-muted-foreground text-center py-8">No payments found.</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
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

          {/* Tab Navigation */}
          <View className="flex-row bg-secondary rounded-lg p-1 mb-6">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'profile' ? 'bg-background' : ''}`}
              onPress={() => setActiveTab('profile')}
            >
              <View className="flex-row items-center justify-center">
                <User size={16} color={activeTab === 'profile' ? '#1e2a4a' : '#6b7280'} />
                <Text className={`ml-2 text-sm font-medium ${
                  activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Profile
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'enquiries' ? 'bg-background' : ''}`}
              onPress={() => setActiveTab('enquiries')}
            >
              <View className="flex-row items-center justify-center">
                <MessageSquare size={16} color={activeTab === 'enquiries' ? '#1e2a4a' : '#6b7280'} />
                <Text className={`ml-2 text-sm font-medium ${
                  activeTab === 'enquiries' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Enquiries
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'loans' ? 'bg-background' : ''}`}
              onPress={() => setActiveTab('loans')}
            >
              <View className="flex-row items-center justify-center">
                <CreditCard size={16} color={activeTab === 'loans' ? '#1e2a4a' : '#6b7280'} />
                <Text className={`ml-2 text-sm font-medium ${
                  activeTab === 'loans' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Loans
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'payments' ? 'bg-background' : ''}`}
              onPress={() => setActiveTab('payments')}
            >
              <View className="flex-row items-center justify-center">
                <FileText size={16} color={activeTab === 'payments' ? '#1e2a4a' : '#6b7280'} />
                <Text className={`ml-2 text-sm font-medium ${
                  activeTab === 'payments' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Payments
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
