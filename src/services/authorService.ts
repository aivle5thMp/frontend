import apiService from './api';
import axios from 'axios';

interface AuthorApplicationData {
  name: string;
  bio: string;
  portfolio_url: string;
}

interface ApplicationResponse {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

class AuthorService {
  private authorApiUrl = 'http://localhost:8081'; // Authors API 포트

  /**
   * 작가 신청 API
   * @param data 작가 신청 데이터
   * @returns API 응답
   */
  async applyForAuthor(data: AuthorApplicationData): Promise<ApplicationResponse> {
    try {
      const response = await apiService.post<{ data: ApplicationResponse }>('/authors/apply', data, {
        baseURL: this.authorApiUrl
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 400) {
        throw new Error('잘못된 요청입니다. 입력 내용을 확인해주세요.');
      } else if (error.code === 409) {
        throw new Error('이미 작가 신청이 진행 중입니다.');
      } else if (error.code === 401) {
        throw new Error('로그인이 필요합니다.');
      }
      throw new Error(error.message || '작가 신청 중 오류가 발생했습니다.');
    }
  }

  /**
   * 작가 신청 상태 확인 API
   * @returns API 응답
   */
  async checkApplicationStatus(): Promise<ApplicationResponse | null> {
    try {
      // 로그인된 사용자의 userId 가져오기
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user || !user.userId) {
        throw new Error('로그인이 필요합니다.');
      }

      // GET 요청에 body로 userId 전송
      const response = await apiService.get<{ data: ApplicationResponse }>('/authors/application-status', {
        baseURL: this.authorApiUrl,
        data: { userId: user.userId }
      });
      return response.data;
    } catch (error: any) {
      // 404인 경우 신청 내역이 없는 것으로 처리
      if (error.code === 404) {
        return null;
      }
      throw new Error(error.message || '상태 확인 중 오류가 발생했습니다.');
    }
  }
}

export const authorService = new AuthorService();
export type { AuthorApplicationData, ApplicationResponse }; 