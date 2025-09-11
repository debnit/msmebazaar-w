
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, Notification } from '@/services/apiService';
import { useFocusEffect } from 'expo-router';
import { Bell, Check } from 'lucide-react-native';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        const result = await apiService.getNotifications();
        if(result.success && result.data) {
            setNotifications(result.data);
        } else {
            Alert.alert("Error", "Could not fetch notifications.");
        }
        setLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchNotifications();
        }, [fetchNotifications])
    );
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications().then(() => setRefreshing(false));
    }, [fetchNotifications]);

    const handleMarkAllRead = async () => {
        const result = await apiService.markNotificationsAsRead();
        if(result.success) {
            Alert.alert("Success", "All notifications marked as read.");
            setNotifications(prev => prev.map(n => ({...n, isRead: true})));
        } else {
            Alert.alert("Error", "Could not mark notifications as read.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-6 pb-2 flex-row justify-between items-center">
                 <Text className="text-2xl font-bold text-primary">Notifications</Text>
                 <TouchableOpacity onPress={handleMarkAllRead} className="flex-row items-center bg-secondary px-3 py-2 rounded-lg">
                    <Check size={16} color="#1e2a4a" />
                    <Text className="text-secondary-foreground ml-2">Mark all as read</Text>
                 </TouchableOpacity>
            </View>
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1e2a4a" />
                </View>
            ) : (
                 <ScrollView 
                    className="p-6 pt-2"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1e2a4a"]} />}
                    >
                    {notifications.length === 0 ? (
                        <View className="flex-1 justify-center items-center mt-20">
                            <Bell size={48} color="#6b7280" />
                            <Text className="text-lg text-muted-foreground mt-4">No notifications yet</Text>
                            <Text className="text-muted-foreground text-center">Important updates about your account will appear here.</Text>
                        </View>
                    ) : (
                        <View className="space-y-4">
                            {notifications.map(notification => (
                                <View key={notification.id} className={`p-4 rounded-lg shadow-sm border-l-4 ${notification.isRead ? 'bg-card border-transparent' : 'bg-secondary border-accent'}`}>
                                    <Text className="font-bold text-lg text-primary">{notification.title}</Text>
                                    <Text className="text-muted-foreground mt-1">{notification.message}</Text>
                                    <Text className="text-xs text-muted-foreground mt-3">{new Date(notification.createdAt).toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
