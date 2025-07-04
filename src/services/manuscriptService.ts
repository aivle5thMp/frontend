import { apiService } from './api';
import type {
  Manuscript,
  ManuscriptListFilters
} from '../types/manuscript';

export class ManuscriptService {

  // 1. 내 원고 목록 조회
  async getMyManuscripts(): Promise<Manuscript[]> {
    const response = await apiService.get<Manuscript[]>('/manuscripts/my');
    return response;
  }

  // 2. 원고 작성
  async createManuscript(manuscript: Manuscript): Promise<string> {
    // 백엔드 CreateReq에 맞춰 title, content만 전송
    const createReq = {
      title: manuscript.title,
      content: manuscript.content
    };
    const response = await apiService.post<{success: boolean, id: string, message: string}>('/manuscripts/create', createReq);
    return response.id;
  }

  // 3. 원고 상세 조회
  async getManuscriptDetail(id: string): Promise<Manuscript | null> {
    try {
      const manuscript = await apiService.get<Manuscript>(
        `/manuscripts/detail/${id}`
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
    return apiService.put<void>('/manuscripts/edit', editReq);
  }

  // 5. 원고 삭제
  async deleteManuscript(id: string): Promise<void> {
    return apiService.delete<void>(`/manuscripts/delete/${id}`);
  }

  // 6. 출간 신청 (즉시 응답, 30초 타임아웃)
  async publishManuscript(id: string): Promise<{success: boolean, id: string, message: string}> {
    const response = await apiService.post<{success: boolean, id: string, message: string}>(`/manuscripts/publish/${id}`, {}, {
      timeout: 30000 // 30초 타임아웃
    });
    return response;
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