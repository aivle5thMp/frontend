import { apiService } from './api';
import type { PurchaseRequest, PurchaseResponse, PointBalanceDTO } from '../types/purchase';
import type { AuthTokens, User } from '../types/auth';

interface PointBalanceResponse {
  data: PointBalanceDTO;
}

class PurchaseService {
  private readonly USER_KEY = 'user';

  /**
   * JWT 토큰에서 페이로드 디코드
   */
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) {
        throw new Error('Invalid token format');
      }
      const base64Payload = parts[1];
      const payload = atob(base64Payload);
      const decodedPayload = JSON.parse(payload);
      console.log('Token payload:', decodedPayload);
      return decodedPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * 유저 정보 업데이트
   */
  private updateUserInfo(accessToken: string): void {
    const payload = this.decodeToken(accessToken);
    if (payload) {
      console.log('Creating user object with payload fields:', {
        sub: payload.sub,
        role: payload.role,
        is_subscribed: payload.is_subscribed
      });
      
      // 기존 유저 정보 가져오기
      const existingUserStr = localStorage.getItem(this.USER_KEY);
      const existingUser = existingUserStr ? JSON.parse(existingUserStr) : null;
      
      // 새로운 유저 정보 (기존 정보 유지하고 구독 상태만 업데이트)
      const user: User = {
        userId: payload.sub,
        email: existingUser?.email,
        name: existingUser?.name,
        role: payload.role,
        isSubscribed: payload.is_subscribed
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log('Updated user info:', user);
    }
  }

  /**
   * 구매 요청 (포인트 또는 구독)
   */
  async purchase(request: PurchaseRequest): Promise<PurchaseResponse> {
    try {
      const response = await apiService.post<{data: PurchaseResponse}>('/payments', request);
      return response.data || response;
    } catch (error: any) {
      console.error('Purchase failed:', error);
      throw new Error(error.message || '구매에 실패했습니다.');
    }
  }

  /**
   * 포인트 구매
   */
  async purchasePoints(amount: number, points: number): Promise<PurchaseResponse> {
    const request: PurchaseRequest = {
      item: 'point',
      amount,
      point: points
    };
    return this.purchase(request);
  }

  /**
   * 구독 구매
   */
  async purchaseSubscription(amount: number): Promise<PurchaseResponse> {
    const request: PurchaseRequest = {
      item: 'subscription',
      amount,
      point: 0
    };
    
    const response = await this.purchase(request);
    
    // 구독 구매 성공 시 새로운 토큰 발급
    if (response) {
      try {
        const currentToken = localStorage.getItem('accessToken');
        if (currentToken) {
          const authResponse = await apiService.post<{auth: AuthTokens}>('/auth/refresh', {
            token: currentToken
          });
          
          if (authResponse.auth?.accessToken) {
            apiService.setTokens(authResponse.auth.accessToken, '');
            this.updateUserInfo(authResponse.auth.accessToken);
          }
        }
      } catch (error) {
        console.error('Failed to get new token after subscription:', error);
      }
    }
    
    return response;
  }

  /**
   * 구매 내역 조회
   */
  async getPurchaseHistory(): Promise<any[]> {
    try {
      const data = await apiService.get<{data: any[]}>('/payments/history');
      return data.data || data;
    } catch (error: any) {
      console.error('Failed to get purchase history:', error);
      return [];
    }
  }

  /**
   * 포인트 balance 조회
   */
  async getPointBalance(): Promise<PointBalanceDTO> {
    try {
      const response = await apiService.get<PointBalanceResponse>('/points/balance');
      if (!response || !response.data) {
        throw new Error('포인트 정보를 불러올 수 없습니다.');
      }
      return response.data;
    } catch (error: any) {
      console.error('Failed to get point balance:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const purchaseService = new PurchaseService();
export default purchaseService; 