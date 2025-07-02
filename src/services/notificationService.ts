import apiService from './api';
import type { Notification, UnreadCountResponse, NotificationIdRequest } from '../types/notification';

class NotificationService {
  private readonly baseUrl = 'http://localhost:8088/notifications';

  // 알림 조회는 authorization 헤더에서 확인할 것임
  async getNotifications(): Promise<Notification[]> {
    return apiService.get<Notification[]>(`${this.baseUrl}`);
  }

  // 안읽은 알림 개수 조회
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiService.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`);
  }

  // 특정 알림을 읽음으로 표시
  async markAsRead(notificationId: string): Promise<void> {
    const request: NotificationIdRequest = { notificationId };
    return apiService.patch<void>(`${this.baseUrl}/read`, request);
  }

  // 모든 알림을 읽음으로 표시
  async markAllAsRead(): Promise<void> {
    return apiService.patch<void>(`${this.baseUrl}/read-all`);
  }
}

export const notificationService = new NotificationService();
export default notificationService; 