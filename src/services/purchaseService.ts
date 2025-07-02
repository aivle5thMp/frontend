import apiService from './api';
import type { PurchaseRequest, PurchaseResponse } from '../types/purchase';

class PurchaseService {
  private readonly baseUrl = 'http://localhost:8086/payments';

  /**
   * 구매 요청 (포인트 또는 구독)
   */
  async purchase(request: PurchaseRequest): Promise<PurchaseResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // 네트워크 에러인지 확인
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
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
      point: 0 // 구독은 포인트가 없으므로 0
    };
    return this.purchase(request);
  }

  /**
   * 구매 내역 조회
   */
  async getPurchaseHistory(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Failed to get purchase history:', error);
      return [];
    }
  }
}

// 싱글톤 인스턴스 생성
export const purchaseService = new PurchaseService();
export default purchaseService; 