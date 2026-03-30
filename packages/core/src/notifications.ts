/**
 * Notification System
 * Toast notifications for user feedback
 */

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  timestamp: Date;
}

export type NotificationCallback = (notification: Notification) => void;

export class NotificationManager {
  private notifications: Notification[] = [];
  private callbacks: Set<NotificationCallback> = new Set();
  private maxNotifications: number = 5;

  show(
    message: string,
    type: NotificationType = NotificationType.INFO,
    title?: string,
    duration: number = 5000
  ): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      title,
      duration,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    
    // Keep only the most recent notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications.shift();
    }

    // Notify listeners
    this.callbacks.forEach(callback => callback(notification));

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, duration);
    }

    return notification.id;
  }

  dismiss(id: string): boolean {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  dismissAll(): void {
    this.notifications = [];
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  onNotification(callback: NotificationCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convenience methods
  info(message: string, title?: string): string {
    return this.show(message, NotificationType.INFO, title);
  }

  success(message: string, title?: string): string {
    return this.show(message, NotificationType.SUCCESS, title);
  }

  warning(message: string, title?: string): string {
    return this.show(message, NotificationType.WARNING, title);
  }

  error(message: string, title?: string): string {
    return this.show(message, NotificationType.ERROR, title);
  }
}

export default NotificationManager;
