import { Redirect, Tabs } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, HandCoins, MessageSquare, CreditCard, User, Gauge } from 'lucide-react-native';
import { View } from 'react-native';

export default function UserLayout() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return null; // Or a loading indicator
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  
  if (user?.isAdmin) {
    return <Redirect href="/(admin)/dashboard" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff6b35', // accent color
        tabBarInactiveTintColor: '#6b7280', // muted-foreground
        tabBarStyle: {
          backgroundColor: '#ffffff', // card color
          borderTopColor: '#d1d5db', // border color
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
       <Tabs.Screen
        name="loan"
        options={{
          title: 'Apply for Loan',
          tabBarIcon: ({ color }) => <HandCoins color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="credit"
        options={{
          title: 'Credit Score',
          tabBarIcon: ({ color }) => <Gauge color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color }) => <CreditCard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="enquiry"
        options={{
          title: 'Enquiry',
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
