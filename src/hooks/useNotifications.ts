import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type NotificationType = 'SECURITY_ALERT' | 'SYSTEM_UPDATE' | 'info' | 'warning' | 'success' | string;

export type Notification = {
  id: string;
  title: string;
  message: string | null;
  type: NotificationType | null;
  read_status: boolean | null;
  link: string | null;
  created_at: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel(`system_notifications_changes_${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_notifications',
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          const icon = newNotification.type === 'SECURITY_ALERT' ? '🛡️'
                     : newNotification.type === 'SYSTEM_UPDATE' ? '📦'
                     : '🔔';
          toast(newNotification.title, {
            description: newNotification.message,
            icon,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read_status).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_status: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      const { error } = await supabase
        .from('system_notifications')
        .update({ read_status: true })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking as read:', error);
      fetchNotifications(); // Revert on error
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
      setUnreadCount(0);

      const { error } = await supabase
        .from('system_notifications')
        .update({ read_status: true })
        .eq('read_status', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all as read:', error);
      fetchNotifications();
    }
  };

  const clearAll = async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);

      const { error } = await supabase
        .from('system_notifications')
        .delete()
        .neq('id', '0'); // Dummy condition to delete all

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      fetchNotifications();
    }
  }

  const sendNotification = async (title: string, message: string, type: NotificationType = 'info', link?: string) => {
    try {
      const { error } = await supabase
        .from('system_notifications')
        .insert({ title, message, type, link });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll,
    sendNotification
  };
};
