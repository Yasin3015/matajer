import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Trash2, Check } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useDeleteNotification } from '@/modules/store/hooks/useNotifications';
import clsx from 'clsx';

const NotificationsPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: paginated, isLoading } = useNotifications(1);
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();

  const notifications = paginated?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-textSecondary hover:text-textPrimary hover:bg-gray-100 p-2 rounded-xl transition-colors"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5 leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-80 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-appBg/50">
            <h3 className="text-sm font-semibold text-textPrimary">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-[10px] text-primary font-semibold bg-primaryLight px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-textSecondary hover:text-textPrimary transition-colors p-0.5 rounded"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                <Bell size={24} className="text-textSecondary/40" />
                <p className="text-textSecondary text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={clsx(
                    'flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-primaryLight transition-colors group',
                    !notification.read_at && 'bg-primaryLight/40'
                  )}
                >
                  {/* Unread dot */}
                  <span
                    className={clsx(
                      'mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0',
                      notification.read_at ? 'bg-transparent' : 'bg-primary'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-textPrimary font-medium leading-tight line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-textSecondary mt-0.5 line-clamp-2">
                      {notification.body}
                    </p>
                    {notification.created_at && (
                      <p className="text-[10px] text-textSecondary/60 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!notification.read_at && (
                      <button
                        onClick={() => markRead.mutate(notification.id)}
                        className="p-1 text-textSecondary hover:text-primary transition-colors rounded"
                        title="Mark as read"
                        disabled={markRead.isPending}
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification.mutate(notification.id)}
                      className="p-1 text-textSecondary hover:text-danger transition-colors rounded"
                      title="Delete"
                      disabled={deleteNotification.isPending}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { NotificationsPanel };
