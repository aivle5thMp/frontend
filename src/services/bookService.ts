import { apiService } from './api';
import type { BookListResponse, BookDetailResponse } from '../types/book';

interface PurchaseHistoryResponse {
  id: string;          // MyBook 엔티티의 ID
  userId: string;      // 구매한 사용자 UUID
  bookId: string;      // 구매한 도서 UUID
  title: string;       // 도서 제목
  authorName: string;  // 작가 이름
  category: string;    // 카테고리
  imageUrl: string;    // 표지 이미지 URL
  createdAt: string;   // 구매 일시 (ISO 8601 형식)
  point: number;       // 사용한 포인트
}

interface BookPurchaseRequest {
  bookId: string;
  point: number;
  title: string;
  authorName: string;
  category: string;
  imageUrl: string;
}

interface BookPurchaseResponse {
  message: string;
  book_id: string;
  point: number;
}

interface BookReadResponse {
  book_id: string;
  title: string;
  author_name: string;
  category: string;
  image_url: string;
  audio_url?: string;
  content: string;
  created_at: string;
}

class BookService {
  /**
   * 책 목록 조회 (인증 불필요)
   * GET /books
   */
  async getBooks(): Promise<BookListResponse> {
    const url = `/books`;
    console.log(`[BookService] 책 목록 요청 시작 - URL: ${url}`);
    
    try {
      const response = await apiService.get<BookListResponse>(url);
      console.log(`[BookService] 책 목록 요청 성공:`, response);
      return response;
    } catch (error) {
      console.error(`[BookService] 책 목록 요청 실패:`, error);
      throw error;
    }
  }

  /**
   * 책 상세 정보 조회 (인증 필요)
   * GET /books/detail/{id}
   * Headers: Authorization: Bearer {token}
   */
  async getBookDetail(bookId: string): Promise<BookDetailResponse> {
    const url = `/books/detail/${bookId}`;
    console.log(`[BookService] 책 상세 정보 요청 시작 - URL: ${url}, bookId: ${bookId}`);
    
    try {
      const response = await apiService.get<BookDetailResponse>(url);
      console.log(`[BookService] 책 상세 정보 요청 성공:`, response);
      return response;
    } catch (error) {
      console.error(`[BookService] 책 상세 정보 요청 실패:`, error);
      throw error;
    }
  }

  /**
   * 책 구매 요청
   * POST /myBook/purchase
   */
  async purchaseBook(request: BookPurchaseRequest): Promise<BookPurchaseResponse> {
    try {
      const response = await apiService.post<BookPurchaseResponse>('/myBook/purchase', request);
      return response;
    } catch (error: any) {
      console.error('[BookService] 책 구매 실패:', error);
      throw error;
    }
  }

  /**
   * 책 구매 여부 확인
   * GET /myBook/check/{id}
   * Headers: Authorization: Bearer {token}
   */
  async checkPurchase(bookId: string): Promise<{ is_purchased: boolean }> {
    return await apiService.get(`/myBook/check/${bookId}`);
  }

  /**
   * 구매 이력 조회
   * GET /myBook/history
   */
  async getPurchaseHistory(): Promise<PurchaseHistoryResponse[]> {
    const url = `/myBook/history`;
    console.log(`[BookService] 구매 이력 조회 시작 - URL: ${url}`);
    
    try {
      const response = await apiService.get<PurchaseHistoryResponse[]>(url);
      console.log(`[BookService] 구매 이력 조회 성공:`, response);
      return response;
    } catch (error) {
      console.error(`[BookService] 구매 이력 조회 실패:`, error);
      throw error;
    }
  }

  async getBookContent(bookId: string): Promise<string> {
    try {
      const response = await fetch(`/myBook/read/${bookId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('책 내용을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('[BookService] getBookContent 실패:', error);
      throw error;
    }
  }

  /**
   * 책 읽기 데이터 조회
   * GET /myBook/read/{bookId}
   */
  async getBookRead(bookId: string): Promise<BookReadResponse> {
    const url = `/myBook/read/${bookId}`;
    console.log(`[BookService] 책 읽기 데이터 요청 시작 - URL: ${url}, bookId: ${bookId}`);
    
    try {
      const response = await apiService.get<BookReadResponse>(url);
      console.log(`[BookService] 책 읽기 데이터 요청 성공:`, response);
      return response;
    } catch (error) {
      console.error(`[BookService] 책 읽기 데이터 요청 실패:`, error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const bookService = new BookService();
export default bookService;


