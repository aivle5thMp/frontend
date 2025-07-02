// Authors 서비스는 별도 포트(8081) 사용

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
      // Authors 서비스 직접 호출 (포트 8081)
      const response = await fetch('http://localhost:8081/authors/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error: any) {
      if (error.message.includes('400')) {
        throw new Error('잘못된 요청입니다. 입력 내용을 확인해주세요.');
      } else if (error.message.includes('409')) {
        throw new Error('이미 작가 신청이 진행 중입니다.');
      } else if (error.message.includes('401')) {
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
      const response = await fetch(`http://localhost:8081/authors/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error: any) {
      // 404인 경우 신청 내역이 없는 것으로 처리
      if (error.message.includes('404')) {
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
      const response = await fetch('http://localhost:8081/authors/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error: any) {
      if (error.message.includes('403')) {
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
      const response = await fetch('http://localhost:8081/authors/review', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          authorId: applicationId,
          status: status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error: any) {
      if (error.message.includes('403')) {
        throw new Error('관리자 권한이 필요합니다.');
      } else if (error.message.includes('404')) {
        throw new Error('해당 신청을 찾을 수 없습니다.');
      }
      const action = status ? '승인' : '거부';
      throw new Error(error.message || `${action} 처리 중 오류가 발생했습니다.`);
    }
  }


}

export const authorService = new AuthorService();
export type { AuthorApplicationData, ApplicationResponse, AuthorApplication }; 