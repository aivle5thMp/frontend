import { apiService } from './api';

interface AuthorApplicationData {
  name: string;
  bio: string;
  portfolioUrl: string;
}

interface ApplicationResponse {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  name?: string;
  createdAt?: string;
  rejectedAt?: string;
  approvedAt?: string;
}

interface AuthorApplication {
  id: string;
  userId: string;
  name: string;
  bio: string;
  portfolioUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

class AuthorService {
  /**
   * 작가 신청 API
   * @param data 작가 신청 데이터
   * @returns API 응답
   */
  async applyForAuthor(data: AuthorApplicationData): Promise<ApplicationResponse> {
    try {
      const result = await apiService.post<{data: ApplicationResponse}>('/authors/apply', data);
      return result.data || result;
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
      const result = await apiService.get<{data: ApplicationResponse}>('/authors/status');
      return result.data || result;
    } catch (error: any) {
      // 404인 경우 신청 내역이 없는 것으로 처리
      if (error.code === 404) {
        return null;
      }
      console.log('Application status check:', error);
      throw new Error(error.message || '상태 확인 중 오류가 발생했습니다.');
    }
  }

  /**
   * 모든 작가 신청 리스트 조회 API (ADMIN용)
   * @returns 작가 신청 리스트
   */
  async getAllApplications(): Promise<AuthorApplication[]> {
    try {
      const result = await apiService.get<{data: AuthorApplication[]}>('/authors/list');
      return result.data || result;
    } catch (error: any) {
      if (error.code === 403) {
        throw new Error('관리자 권한이 필요합니다.');
      }
      throw new Error(error.message || '신청 리스트 조회 중 오류가 발생했습니다.');
    }
  }

  /**
   * 작가 신청 승인/거부 API (ADMIN용)
   * @param applicationId 신청 ID
   * @param status true=승인, false=거부
   */
  async updateApplicationStatus(applicationId: string, status: boolean): Promise<void> {
    try {
      await apiService.patch<void>('/authors/review', {
        authorId: applicationId,
        status: status
      });
    } catch (error: any) {
      if (error.code === 403) {
        throw new Error('관리자 권한이 필요합니다.');
      } else if (error.code === 404) {
        throw new Error('해당 신청을 찾을 수 없습니다.');
      }
      const action = status ? '승인' : '거부';
      throw new Error(error.message || `${action} 처리 중 오류가 발생했습니다.`);
    }
  }


}

export const authorService = new AuthorService();
export type { AuthorApplicationData, ApplicationResponse, AuthorApplication }; 