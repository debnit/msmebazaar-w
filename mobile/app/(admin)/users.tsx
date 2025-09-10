import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const users = [
    { id: '1', name: 'Rohan Sharma', email: 'rohan@example.com', isAdmin: false },
    { id: '2', name: 'Priya Patel', email: 'priya@example.com', isAdmin: true },
    { id: '3', name: 'Admin User', email: 'admin@example.com', isAdmin: true },
];

export default function AdminUsersScreen() {
    const handleRoleChange = (id: string, isAdmin: boolean) => {
        Alert.alert(
            'Change User Role',
            `Are you sure you want to ${isAdmin ? 'remove admin role for' : 'make'} this user ${isAdmin ? '' : 'an admin'}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => console.log('Update role') },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="p-6">
                <Text className="text-2xl font-bold text-primary mb-6">Manage Users</Text>
                <View className="space-y-4">
                    {users.map(user => (
                        <View key={user.id} className="bg-card p-4 rounded-lg shadow">
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="font-bold text-foreground">{user.name}</Text>
                                    <Text className="text-sm text-muted-foreground">{user.email}</Text>
                                </View>
                                {user.isAdmin && (
                                     <Text className="font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Admin</Text>
                                )}
                            </View>
                             <TouchableOpacity 
                                className="bg-secondary p-2 rounded-md self-start mt-4"
                                onPress={() => handleRoleChange(user.id, user.isAdmin)}
                            >
                                <Text className="text-secondary-foreground text-sm font-semibold">
                                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
