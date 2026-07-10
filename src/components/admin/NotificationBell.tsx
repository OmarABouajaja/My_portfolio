import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-background-elevated transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background-elevated/30">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={markAllAsRead} 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <Check className="w-3 h-3" />
              </button>
              <button 
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Bell className="w-8 h-8 opacity-20" />
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-border/20 last:border-0 transition-colors hover:bg-background-elevated/50 ${!notification.read_status ? 'bg-primary/5' : ''}`}
                  onClick={() => !notification.read_status && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className={`text-sm font-medium leading-snug ${!notification.read_status ? 'text-foreground' : 'text-foreground/80'}`}>
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-mono">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                        {notification.link && (
                          <a 
                            href={notification.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {!notification.read_status && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
