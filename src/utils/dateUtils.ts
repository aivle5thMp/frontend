/**
 * 최근 일주일 이내에 등록된 새로운 책인지 확인하는 함수
 * @param createdAt 책 등록일 (ISO 8601 형식의 날짜 문자열)
 * @returns boolean
 */
export const isNewBook = (createdAt: string): boolean => {
  const now = new Date('2025-07-01'); // 현재 날짜를 2025년 7월 1일로 고정
  const createDate = new Date(createdAt);
  const diffTime = Math.abs(now.getTime() - createDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 7;
};

/**
 * ISO 8601 형식의 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
 * @param isoDate ISO 8601 형식의 날짜 문자열
 * @returns string
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}; 