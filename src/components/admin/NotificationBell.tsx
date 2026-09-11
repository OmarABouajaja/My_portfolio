import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Check, Trash2, ExternalLink, ShieldAlert, PackageCheck, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';

const NotificationIcon = ({ type }: { type: string | null }) => {
  switch (type) {
    case 'SECURITY_ALERT':
      return <ShieldAlert className="w-4 h-4 text-destructive shrink-0" />;
    case 'SYSTEM_UPDATE':
      return <PackageCheck className="w-4 h-4 text-primary shrink-0" />;
    default:
      return <Info className="w-4 h-4 text-muted-foreground shrink-0" />;
  }
};

const notificationAccent = (type: string | null) => {
  switch (type) {
    case 'SECURITY_ALERT':
      return 'border-l-destructive bg-destructive/5';
    case 'SYSTEM_UPDATE':
      return 'border-l-primary bg-primary/5';
    default:
      return 'border-l-muted-foreground/30';
  }
};

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-background-elevated transition-colors group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.8)] z-10">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
              <span className="absolute top-1 right-1 flex h-4 w-4 rounded-full bg-destructive animate-ping opacity-75 z-0" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 border border-border/50 bg-background/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden relative" align="end" sideOffset={12}>
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/scanline.png')] mix-blend-overlay z-0" />
        <div className="absolute inset-0 pointer-events-none opacity-5 z-0" style={{ backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background-elevated/40 relative z-10 backdrop-blur-md">
          <h3 className="terminal-text text-xs uppercase tracking-widest text-primary flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" /> System Alerts
          </h3>
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
        
        <div className="max-h-[400px] overflow-y-auto hide-scrollbar relative z-10">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-dashed border-border/50 flex items-center justify-center bg-background-elevated/20">
                <Bell className="w-5 h-5 opacity-40" />
              </div>
              <p className="terminal-text text-[10px] uppercase tracking-widest opacity-60">System metrics nominal.<br/>No active alerts.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification, idx) => (
                <div 
                  key={notification.id} 
                  className={`group relative p-4 border-b border-border/20 last:border-0 transition-all duration-300 hover:bg-primary/5 border-l-2 cursor-pointer ${notificationAccent(notification.type)} ${!notification.read_status ? 'opacity-100 bg-background-elevated/30' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => !notification.read_status && markAsRead(notification.id)}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-primary/10 to-transparent group-hover:w-full transition-all duration-500 pointer-events-none" />
                  <div className="flex items-start gap-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    <div className={`p-1.5 rounded-md ${notification.type === 'SECURITY_ALERT' ? 'bg-destructive/10' : notification.type === 'SYSTEM_UPDATE' ? 'bg-primary/10' : 'bg-muted/10'}`}>
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className={`text-xs font-bold uppercase tracking-wide leading-snug ${!notification.read_status ? 'text-foreground' : 'text-foreground/80'}`}>
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-1">
                        {notification.type && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                            notification.type === 'SECURITY_ALERT' ? 'bg-destructive/10 text-destructive' :
                            notification.type === 'SYSTEM_UPDATE' ? 'bg-primary/10 text-primary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        )}
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
                      <div className="relative w-2 h-2 shrink-0 mt-1.5">
                        <div className="absolute inset-0 rounded-full bg-primary" />
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping" />
                      </div>
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
