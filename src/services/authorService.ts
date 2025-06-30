import { authorApiService } from './apis/authorApi';

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
  /**
   * 작가 신청 API
   * @param data 작가 신청 데이터
   * @returns API 응답
   */
  async applyForAuthor(data: AuthorApplicationData): Promise<ApplicationResponse> {
    try {
      const response = await authorApiService.post<{ data: ApplicationResponse }>('/authors/apply', data);
      return response.data;
    } catch (error: any) {
      // authorApiService에서 이미 에러 처리를 했지만, 더 구체적인 메시지 제공
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
   * @param userId 사용자 ID (선택사항 - 토큰에서 추출 가능한 경우)
   * @returns API 응답
   */
  async checkApplicationStatus(userId?: string): Promise<ApplicationResponse | null> {
    try {
      const url = userId 
        ? `/authors/application-status/${userId}` 
        : '/authors/application-status';
      
      const response = await authorApiService.get<{ data: ApplicationResponse }>(url);
      return response.data;
    } catch (error: any) {
      // 404인 경우 신청 내역이 없는 것으로 처리
      if (error.code === 404) {
        return null;
      }
      throw new Error(error.message || '상태 확인 중 오류가 발생했습니다.');
    }
  }

  /**
   * 작가 신청 수정 API
   * @param data 수정할 데이터
   * @returns API 응답
   */
  async updateApplication(data: Partial<AuthorApplicationData>): Promise<ApplicationResponse> {
    try {
      const response = await authorApiService.patch<{ data: ApplicationResponse }>('/authors/application', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || '신청 수정 중 오류가 발생했습니다.');
    }
  }
}

export const authorService = new AuthorService();
export type { AuthorApplicationData, ApplicationResponse }; 