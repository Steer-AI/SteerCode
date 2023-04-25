import type { NotificationType, Position } from '$lib/models/enums/notifications';
import { writable } from 'svelte/store';


export type DefaultNotificationOptions = {
  id?: string;
  position?: Position;
  text: string;
  type: NotificationType;
  removeAfter?: number;
} & Record<string, any>;

export type NotificationStore = {
  subscribe: (
    run: (notifications: DefaultNotificationOptions[]) => void
  ) => () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
};

const createStore = () => {
  const { subscribe, update, set } = writable<DefaultNotificationOptions[]>([]);

  const addNotification = (notification: DefaultNotificationOptions) => {
    if (!notification) return;

    const safeNotification: DefaultNotificationOptions = {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 9999)}`,
      position: 'bottom-center',
      ...notification
    };
    update((notifications) => {
      if (safeNotification.position?.includes('top-')) {
        return [safeNotification, ...notifications];
      }

      return [...notifications, safeNotification];
    });
  };

  const clearNotifications = () => set([]);

  const removeNotification = (notificationId: string | undefined) => {
    if (!notificationId) return;

    update((notifications) =>
      notifications.filter(({ id }) => id !== notificationId)
    );
  };

  return {
    subscribe: subscribe,
    addNotification,
    removeNotification,
    clearNotifications
  };
};

export const notificationStore = createStore();
