import apiService from './api';
import type { Notification, UnreadCountResponse, NotificationIdRequest } from '../types/notification';

class NotificationService {
  private readonly baseUrl = 'http://localhost:8088/notifications';

  // 사용자의 모든 알림 조회
  async getNotifications(userId: string): Promise<Notification[]> {
    return apiService.get<Notification[]>(`${this.baseUrl}?userId=${userId}`);
  }

  // 안읽은 알림 개수 조회
  async getUnreadCount(userId: string): Promise<UnreadCountResponse> {
    return apiService.get<UnreadCountResponse>(`${this.baseUrl}/unread-count?userId=${userId}`);
  }

  // 특정 알림을 읽음으로 표시
  async markAsRead(notificationId: string): Promise<void> {
    const request: NotificationIdRequest = { notificationId };
    return apiService.patch<void>(`${this.baseUrl}/read`, request);
  }

  // 모든 알림을 읽음으로 표시
  async markAllAsRead(userId: string): Promise<void> {
    const request = { userId };
    return apiService.patch<void>(`${this.baseUrl}/read-all`, request);
  }
}

export const notificationService = new NotificationService();
export default notificationService; 