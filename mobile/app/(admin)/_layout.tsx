import { Redirect, Tabs } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, FileText, Briefcase, Banknote, Users } from 'lucide-react-native';

export default function AdminLayout() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return null; // Or a loading indicator
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return <Redirect href="/login" />;
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
        headerStyle: {
            backgroundColor: '#1e2a4a',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Admin Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
       <Tabs.Screen
        name="enquiries"
        options={{
          title: 'Enquiries',
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color }) => <Briefcase color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color }) => <Banknote color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
