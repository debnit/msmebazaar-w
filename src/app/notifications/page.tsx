
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      // Refetch or update state locally
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your account activity.</p>
        </div>
        <Button onClick={markAllAsRead} disabled={notifications.every(n => n.isRead)}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-16">
              <BellRing className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No notifications yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll let you know when something important happens.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
                {notifications.map((notification) => (
                    <li key={notification.id} className={cn("p-6 flex items-start gap-4", !notification.isRead && "bg-secondary/50")}>
                        <div className={cn("mt-1 h-2 w-2 rounded-full", !notification.isRead ? "bg-accent" : "bg-transparent")}></div>
                        <div className="flex-1">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                    </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
