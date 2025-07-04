// 책 기본 정보 인터페이스 (백엔드 엔티티 구조에 맞춤)
export interface Book {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  audioUrl?: string;
  todayCount: number;
  totalCount: number;
  createdAt: string;
}

// API 응답에서 받는 북 리스트 아이템 (백엔드 응답 형태)
export interface BookListItem {
  bookId: string;
  title: string;
  authorName: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  todayCount: number;
  totalCount: number;
}

// BookCard 전용 인터페이스 (전체보기 리스트용)
export interface BookCardData {
  id: string;
  title: string;
  authorName: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  todayCount: number;
  totalCount: number;
}

// 책 상세 정보 인터페이스
export interface BookDetail {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  category: string;
  summary: string;
  point: number;
  imageUrl: string;
  audioUrl?: string;
  todayCount: number;
  totalCount: number;
  createdAt: string;
}

// API 응답 인터페이스
export interface BookListResponse {
  data: BookListItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

// API 상세 응답 인터페이스
export interface BookDetailResponse {
  bookId: string;
  authorName: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  point: number;
  todayCount: number;
  totalCount: number;
  createdAt: string;
}


export interface BookRead {
  book_id: string;
  title: string;
  author_name: string;
  category: string;
  image_url: string;
  created_at: string;
  audio_url: string;
  content: string;
}


// 전체보기용 데이터 구조
export interface BookLists {
  monthlyBooks: BookCardData[];
  trendingBooks: BookCardData[];
  allBooks: BookCardData[];
}

export type BookCategory = 
  | '전체'
  | '새로 나온 책'
  | '소설'
  | '경제/경영'
  | '자기계발'
  | '인물'
  | '역사'
  | '시/에세이'
  | '어린이'
  | '종교'
  | '국어/외국어'
  | '사회/정치'
  | '과학'
  | '가정/생활'
  | '문학/예술'
  | '청소년'
  | '유아'
  | '영어 오디오북'
  | '웹소설';

