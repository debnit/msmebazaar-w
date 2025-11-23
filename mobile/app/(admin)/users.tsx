
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, AdminUser } from '@/services/apiService';
import { useAuthStore } from '@/store/authStore';
import { Search } from 'lucide-react-native';

type RoleFilter = 'all' | 'admin' | 'agent' | 'user';

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

export default function AdminUsersScreen() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { user: currentUser } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchUsers = useCallback(async (query: string, filter: RoleFilter) => {
        setLoading(true);
        const result = await apiService.getUsers(query, filter);
        if (result.success && result.data) {
            setUsers(result.data);
        } else {
            Alert.alert('Error', result.error || 'Failed to fetch users.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers(debouncedSearchQuery, roleFilter);
    }, [debouncedSearchQuery, roleFilter, fetchUsers]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers(debouncedSearchQuery, roleFilter).then(() => setRefreshing(false));
    }, [debouncedSearchQuery, roleFilter, fetchUsers]);

    const handleRoleChange = (user: AdminUser) => {
        if (user.id === currentUser?.id) {
            Alert.alert("Cannot Change Role", "You cannot change your own admin status.");
            return;
        }

        Alert.alert(
            'Change User Role',
            `Are you sure you want to ${user.isAdmin ? 'remove admin role for' : 'make'} this user ${user.isAdmin ? '' : 'an admin'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => updateUserRole(user) },
            ]
        );
    };
    
    const handleAgentChange = (user: AdminUser) => {
        Alert.alert(
            'Change Agent Status',
            `Are you sure you want to ${user.isAgent ? 'remove agent status for' : 'make'} this user ${user.isAgent ? '' : 'an agent'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => updateUserAgentStatus(user) },
            ]
        );
    };

    const updateUserRole = async (user: AdminUser) => {
        setUpdatingId(user.id);
        const result = await apiService.updateUserRole(user.id, !user.isAdmin);
        if (result.success) {
            onRefresh();
            Alert.alert('Success', "User role updated successfully.");
        } else {
            Alert.alert('Error', result.error || "Failed to update user role.");
        }
        setUpdatingId(null);
    }
    
    const updateUserAgentStatus = async (user: AdminUser) => {
        setUpdatingId(user.id);
        const result = await apiService.updateUserAgentStatus(user.id, !user.isAgent);
        if (result.success) {
            onRefresh();
            Alert.alert('Success', "User agent status updated successfully.");
        } else {
            Alert.alert('Error', result.error || "Failed to update user agent status.");
        }
        setUpdatingId(null);
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-6 pb-2">
                <Text className="text-2xl font-bold text-primary mb-4">Manage Users</Text>
                <View className="flex-row items-center bg-card border border-border rounded-lg px-3 mb-4">
                    <Search size={20} color="#6b7280" />
                    <TextInput 
                        placeholder='Search by name or email...'
                        className='flex-1 p-3 text-foreground'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View className="flex-row justify-around mb-4">
                    <TouchableOpacity onPress={() => setRoleFilter('all')} className={`px-3 py-2 rounded-full ${roleFilter === 'all' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={`text-xs ${roleFilter === 'all' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRoleFilter('admin')} className={`px-3 py-2 rounded-full ${roleFilter === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={`text-xs ${roleFilter === 'admin' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>Admins</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRoleFilter('agent')} className={`px-3 py-2 rounded-full ${roleFilter === 'agent' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={`text-xs ${roleFilter === 'agent' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>Agents</Text>
                    </TouchableOpacity>
                     <TouchableOpacity onPress={() => setRoleFilter('user')} className={`px-3 py-2 rounded-full ${roleFilter === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                        <Text className={`text-xs ${roleFilter === 'user' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>Users</Text>
                    </TouchableOpacity>
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
                    {users.length === 0 ? (
                        <Text className="text-center text-muted-foreground mt-10">No users found.</Text>
                    ) : (
                        <View className="space-y-4">
                            {users.map(user => (
                                <View key={user.id} className="bg-card p-4 rounded-lg shadow">
                                    <View className="flex-row justify-between items-start mb-4">
                                        <View>
                                            <Text className="font-bold text-foreground">{user.name}</Text>
                                            <Text className="text-sm text-muted-foreground">{user.email}</Text>
                                        </View>
                                        <View className="flex-col items-end gap-y-2">
                                          {user.isAdmin && (
                                              <Text className="font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Admin</Text>
                                          )}
                                          {user.isAgent && (
                                              <Text className="font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Agent</Text>
                                          )}
                                        </View>
                                    </View>
                                    <View className="flex-row space-x-2">
                                      <TouchableOpacity 
                                          className={`bg-secondary p-2 rounded-md self-start ${user.id === currentUser?.id ? 'opacity-50' : ''}`}
                                          onPress={() => handleRoleChange(user)}
                                          disabled={updatingId === user.id || user.id === currentUser?.id}
                                      >
                                          {updatingId === user.id ? (
                                              <ActivityIndicator color="#1e2a4a" />
                                          ) : (
                                              <Text className="text-secondary-foreground text-sm font-semibold">
                                                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                              </Text>
                                          )}
                                      </TouchableOpacity>
                                       <TouchableOpacity 
                                          className={`bg-secondary p-2 rounded-md self-start`}
                                          onPress={() => handleAgentChange(user)}
                                          disabled={updatingId === user.id}
                                      >
                                          {updatingId === user.id ? (
                                              <ActivityIndicator color="#1e2a4a" />
                                          ) : (
                                              <Text className="text-secondary-foreground text-sm font-semibold">
                                                  {user.isAgent ? 'Remove Agent' : 'Make Agent'}
                                              </Text>
                                          )}
                                      </TouchableOpacity>
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
