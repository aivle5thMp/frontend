import apiService from './api';
import type { Notification, UnreadCountResponse, NotificationIdRequest } from '../types/notification';

class NotificationService {

  // 알림 조회는 authorization 헤더에서 확인할 것임
  async getNotifications(): Promise<Notification[]> {
    return apiService.get<Notification[]>('/notifications');
  }

  // 안읽은 알림 개수 조회
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiService.get<UnreadCountResponse>('/notifications/unread-count');
  }

  // 특정 알림을 읽음으로 표시
  async markAsRead(notificationId: string): Promise<void> {
    const request: NotificationIdRequest = { notificationId };
    return apiService.patch<void>('/notifications/read', request);
  }

  // 모든 알림을 읽음으로 표시
  async markAllAsRead(): Promise<void> {
    return apiService.patch<void>('/notifications/read-all');
  }
}

export const notificationService = new NotificationService();
export default notificationService; 