import type { BookCardData, BookCategory } from '../types/book';
import { isNewBook } from './dateUtils';

// 오늘 조회수 기반 정렬
export const sortByTodayCount = (books: BookCardData[]): BookCardData[] => {
  return [...books].sort((a, b) => b.todayCount - a.todayCount);
};

// 총 조회수 기반 정렬
export const sortByTotalCount = (books: BookCardData[]): BookCardData[] => {
  return [...books].sort((a, b) => b.totalCount - a.totalCount);
};

// 등록일 기반 정렬 (최신순)
export const sortByDate = (books: BookCardData[]): BookCardData[] => {
  return [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 이달의 추천 도서 선별 (총 조회수 기반)
export const getMonthlyRecommendedBooks = (books: BookCardData[], limit: number = 12): BookCardData[] => {
  // 총 조회수 높은 순으로 정렬
  return sortByTotalCount(books).slice(0, limit);
};

// 인기 급상승 도서 선별 (오늘 조회수 기반)
export const getTrendingBooks = (books: BookCardData[], limit: number = 5): BookCardData[] => {
  // 최근 1달 내 책 중에서 오늘 조회수 높은 순
  const recentBooks = books.filter(book => {
    const bookDate = new Date(book.createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return bookDate >= oneMonthAgo;
  });

  return sortByTodayCount(recentBooks).slice(0, limit);
};

// 카테고리별 필터링
export const filterByCategory = (books: BookCardData[], category: BookCategory): BookCardData[] => {
  if (category === '전체') {
    return books;
  }
  
  if (category === '새로 나온 책') {
    return books.filter(book => isNewBook(book.createdAt));
  }
  
  return books.filter(book => book.category === category);
};

// 새로 나온 책 마킹
export const markNewBooks = (books: BookCardData[]): BookCardData[] => {
  return books.map(book => ({
    ...book,
    isNew: isNewBook(book.createdAt)
  }));
};

// 전체 데이터 처리 및 분배
export const processBookData = (allBooks: BookCardData[]) => {
  const processedBooks = markNewBooks(allBooks);
  
  return {
    monthlyBooks: getMonthlyRecommendedBooks(processedBooks, 12),
    trendingBooks: getTrendingBooks(processedBooks, 5),
    allBooks: processedBooks
  };
}; 