export interface Notification {
  notificationId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationIdRequest {
  notificationId: string;
}

export interface NotificationUserRequest {
  userId: string;
} 