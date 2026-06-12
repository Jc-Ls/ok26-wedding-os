/**
 * Notification & Haptic Feedback Utilities
 * Sends notifications to kitchen staff, admins, and guests
 * Includes browser notifications, haptic feedback, and toast messages
 */

export type NotificationType = 'order' | 'status' | 'info' | 'warning' | 'success';

export interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  tag?: string; // For grouping similar notifications
  requireInteraction?: boolean; // Keep notification until user dismisses
  hapticPattern?: number[]; // Vibration pattern: [vibrate, pause, vibrate, ...]
}

/**
 * Send desktop/browser notification
 * Requires user to grant permission first
 */
export async function sendNotification(payload: NotificationPayload) {
  // Only works in browser
  if (typeof window === 'undefined') return;

  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return;
  }

  // Request permission if not granted
  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied');
    return;
  }

  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
  }

  // Determine icon based on notification type
  const iconMap: Record<NotificationType, string> = {
    order: '🍽️',
    status: '📍',
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
  };

  const icon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">${iconMap[payload.type]}</text></svg>`;

  try {
    const notification = new Notification(payload.title, {
      body: payload.message,
      icon,
      tag: payload.tag || payload.type, // Group notifications with same tag
      requireInteraction: payload.requireInteraction ?? false,
      badge: icon,
    });

    // Close notification after 5 seconds if not requiring interaction
    if (!payload.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

/**
 * Vibrate device (haptic feedback)
 * Pattern: [vibrate duration, pause duration, vibrate duration, ...]
 */
export function triggerHaptic(pattern: number | number[]) {
  if (typeof window === 'undefined') return;

  if (!navigator.vibrate) {
    console.warn('Device does not support vibration');
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Vibration failed:', error);
  }
}

/**
 * Haptic patterns for common events
 */
export const HapticPatterns = {
  newOrder: [200, 100, 200, 100, 200], // Strong triple vibration
  statusUpdate: [100, 50, 100], // Double tap
  completed: [300, 100, 300], // Double long buzz
  error: [100, 200, 100], // Alert pattern
  success: [50, 50, 50, 50, 200], // Quick success
};

/**
 * Notify kitchen staff of new order
 */
export async function notifyKitchenNewOrder(tableNumber: string, mealName: string, orderId: string) {
  const hapticPattern = HapticPatterns.newOrder;

  await sendNotification({
    title: `🍽️ NEW ORDER - Table ${tableNumber}`,
    message: `${mealName}`,
    type: 'order',
    tag: `order-${orderId}`,
    requireInteraction: true, // Keep until kitchen acknowledges
    hapticPattern,
  });

  // Also log to console for debugging
  console.log(`[KITCHEN ORDER] Table: ${tableNumber}, Meal: ${mealName}, ID: ${orderId}`);
}

/**
 * Notify admin of order update
 */
export async function notifyAdminOrderUpdate(tableNumber: string, status: string, orderId: string) {
  const hapticPattern = HapticPatterns.statusUpdate;

  await sendNotification({
    title: `📋 ORDER UPDATE - Table ${tableNumber}`,
    message: `Status: ${status}`,
    type: 'status',
    tag: `admin-${orderId}`,
    hapticPattern,
  });

  console.log(`[ADMIN UPDATE] Table: ${tableNumber}, Status: ${status}, ID: ${orderId}`);
}

/**
 * Notify guest of order status change
 */
export async function notifyGuestStatusChange(status: string, orderId: string) {
  const hapticPattern = HapticPatterns.statusUpdate;

  const statusMessages: Record<string, string> = {
    Pending: '⏳ Your order has been received by the kitchen',
    'In Progress': '👨‍🍳 Your meal is being prepared',
    'On the Way': '🚴 Your order is on the way!',
    Completed: '✅ Your order has arrived!',
  };

  const message = statusMessages[status] || `Your order status: ${status}`;

  await sendNotification({
    title: '📱 Order Status Update',
    message,
    type: 'status',
    tag: `guest-${orderId}`,
    hapticPattern,
  });

  console.log(`[GUEST NOTIFICATION] Status: ${status}, ID: ${orderId}`);
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Check if notifications are enabled
 */
export function areNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && Notification.permission === 'granted';
}