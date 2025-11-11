import { useState, useEffect } from 'react';
import { NotificationManager, Notification, NotificationType } from '@voxforge/core';
import './NotificationPanel.css';

interface NotificationPanelProps {
  manager: NotificationManager;
}

function NotificationPanel({ manager }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = manager.onNotification(() => {
      setNotifications(manager.getAll());
    });

    return () => {
      unsubscribe();
    };
  }, [manager]);

  const getIcon = (type: NotificationType): string => {
    switch (type) {
      case NotificationType.SUCCESS:
        return '✅';
      case NotificationType.WARNING:
        return '⚠️';
      case NotificationType.ERROR:
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const handleDismiss = (id: string) => {
    manager.dismiss(id);
    setNotifications(manager.getAll());
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-panel">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <span className="notification-icon">{getIcon(notification.type)}</span>
            <div className="notification-text">
              {notification.title && (
                <div className="notification-title">{notification.title}</div>
              )}
              <div className="notification-message">{notification.message}</div>
            </div>
          </div>
          <button
            className="notification-close"
            onClick={() => handleDismiss(notification.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;
