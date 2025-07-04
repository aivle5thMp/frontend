import type { BookListItem, BookCardData, BookDetail, BookDetailResponse } from '../types/book';

// API 응답의 BookListItem을 BookCardData로 변환
export const transformToBookCardData = (bookItem: BookListItem): BookCardData => {
  return {
    id: bookItem.bookId,
    title: bookItem.title,
    authorName: bookItem.authorName,
    category: bookItem.category,
    imageUrl: bookItem.imageUrl,
    createdAt: bookItem.createdAt,
    todayCount: bookItem.todayCount,
    totalCount: bookItem.totalCount
  };
};

// API 응답의 BookListItem 배열을 BookCardData 배열로 변환
export const transformToBookCardDataList = (bookItems: BookListItem[]): BookCardData[] => {
  return bookItems.map(transformToBookCardData);
};

// BookCardData나 API 응답을 BookDetail로 변환하는 함수
export const transformToBookDetail = (data: BookCardData | BookDetailResponse): BookDetail => {
  // API 응답인 경우
  if ('bookId' in data) {
    return {
      id: data.bookId,
      authorId: `author_${data.bookId}`, // 임시 author ID 생성
      authorName: data.authorName,
      title: data.title,
      point: data.point || 1000, // API 응답의 point 값 사용, 없으면 기본값 1000
      category: data.category,
      summary: data.summary,
      imageUrl: data.imageUrl,
      todayCount: 0, // API 응답에 없는 경우 기본값
      totalCount: 0, // API 응답에 없는 경우 기본값
      createdAt: new Date().toISOString() // API 응답에 없는 경우 현재 시간
    };
  }
  
  // BookCardData인 경우 (샘플 데이터)
  return {
    id: data.id,
    authorId: `author_${data.id}`, // 임시 author ID 생성
    authorName: data.authorName,
    title: data.title,
    point: 1000, // 샘플 포인트
    category: data.category,
    summary: generateSummary(data.title, data.category), // 임시 줄거리 생성
    imageUrl: data.imageUrl,
    todayCount: data.todayCount,
    totalCount: data.totalCount,
    createdAt: data.createdAt
  };
};

// BookCardData나 API 응답을 BookDetailResponse로 변환하는 함수
export const transformToBookDetailResponse = (data: BookCardData | BookDetailResponse): BookDetailResponse => {
  // 이미 BookDetailResponse 형식인 경우
  if ('bookId' in data) {
    return {
      ...data,
      todayCount: data.todayCount || 0,
      totalCount: data.totalCount || 0,
      createdAt: data.createdAt || new Date().toISOString()
    };
  }
  
  // BookCardData인 경우 (샘플 데이터)
  return {
    bookId: data.id,
    authorName: data.authorName,
    title: data.title,
    category: data.category,
    summary: generateSummary(data.title, data.category),
    imageUrl: data.imageUrl,
    point: 1000,
    todayCount: data.todayCount,
    totalCount: data.totalCount,
    createdAt: data.createdAt
  };
};

// 책 제목과 카테고리에 따라 임시 줄거리 생성
const generateSummary = (title: string, category: string): string => {
  const summaryTemplates = {
    '소설': `"${title}"은 독자들을 매혹시키는 흥미진진한 이야기입니다. 복잡한 인물들과 예측할 수 없는 전개로 마지막 페이지까지 놓을 수 없는 작품입니다.`,
    '자기계발': `"${title}"은 개인의 성장과 발전을 위한 실용적인 통찰과 전략을 제공합니다. 일상에서 바로 적용할 수 있는 구체적인 방법들을 담고 있습니다.`,
    '경제/경영': `"${title}"은 현대 비즈니스 환경에서 성공하기 위한 핵심 원리와 실전 경험을 담았습니다. 경영진과 직장인 모두에게 유용한 인사이트를 제공합니다.`,
    '과학': `"${title}"은 복잡한 과학 개념을 쉽게 설명하며, 최신 연구 결과와 이론을 일반인도 이해할 수 있도록 풀어냅니다.`,
    '역사': `"${title}"은 과거의 중요한 사건들과 인물들을 통해 역사의 흐름을 이해할 수 있도록 도와줍니다. 재미있는 일화들로 가득한 역사서입니다.`,
    '시/에세이': `"${title}"은 일상의 소소한 순간들을 아름다운 문장으로 담아낸 작품입니다. 독자의 마음을 따뜻하게 만드는 감성적인 글들을 만나보세요.`,
    '웹소설': `"${title}"은 흥미진진한 판타지 세계관과 매력적인 캐릭터들로 독자들을 사로잡는 웹소설입니다. 매일 업데이트되는 새로운 에피소드를 기대해주세요.`
  };

  return summaryTemplates[category as keyof typeof summaryTemplates] || 
         `"${title}"은 ${category} 분야의 훌륭한 작품으로, 독자들에게 새로운 관점과 깊이 있는 사고를 제공합니다. 이 책을 통해 새로운 지식과 감동을 경험해보세요.`;
}; 