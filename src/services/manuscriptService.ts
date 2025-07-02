import { apiService } from './api';
import type {
  Manuscript,
  ManuscriptListFilters
} from '../types/manuscript';

export class ManuscriptService {

  // baseurl
  private readonly baseUrl = 'http://localhost:8082/manuscripts';

  // 1. 내 원고 목록 조회
  async getMyManuscripts(): Promise<Manuscript[]> {
    const response = await apiService.get<Manuscript[]>(`${this.baseUrl}/my`);
    return response;
  }

  // 2. 원고 작성
  async createManuscript(manuscript: Manuscript): Promise<string> {
    // 백엔드 CreateReq에 맞춰 title, content만 전송
    const createReq = {
      title: manuscript.title,
      content: manuscript.content
    };
    const response = await apiService.post<{success: boolean, id: string, message: string}>(`${this.baseUrl}/create`, createReq);
    return response.id;
  }

  // 3. 원고 상세 조회
  async getManuscriptDetail(id: string): Promise<Manuscript | null> {
    try {
      const manuscript = await apiService.get<Manuscript>(
        `${this.baseUrl}/detail/${id}`
      );
      return manuscript;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      throw error;
    }
  }

  // 4. 원고 수정
  async editManuscript(manuscript: Manuscript): Promise<void> {
    // 백엔드 EditReq에 맞춰 id, title, content만 전송
    const editReq = {
      id: manuscript.id,
      title: manuscript.title,
      content: manuscript.content
    };
    return apiService.put<void>(`${this.baseUrl}/edit`, editReq);
  }

  // 5. 원고 삭제
  async deleteManuscript(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // 6. 출간 신청
  async publishManuscript(id: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/publish/${id}`);
  }

  // 추가: 원고 필터링 및 검색
  async getFilteredManuscripts(filters: ManuscriptListFilters): Promise<Manuscript[]> {
    const manuscripts = await this.getMyManuscripts();
    
    let filtered = manuscripts;
    
    if (filters.status) {
      filtered = filtered.filter(m => m.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm) || 
        m.content.toLowerCase().includes(searchTerm)
      );
    }
    
    return filtered;
  }
}

// 싱글톤 인스턴스 생성
export const manuscriptService = new ManuscriptService();
export default manuscriptService; 