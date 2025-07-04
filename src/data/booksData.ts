import type { BookCardData } from '../types/book';

// 전체보기용 도서 데이터 (BookCard 표시용) - 2025년 7월 5일 기준
export const allBooksData: BookCardData[] = [
  // 최신 인기 도서들
  {
    id: "sample-trend-1",
    title: "2025 트렌드 코리아",
    authorName: "김난도",
    category: "사회/정치",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    createdAt: "2025-06-15T09:00:00",
    todayCount: 15,
    totalCount: 35
  },
  {
    id: "sample-science-1",
    title: "AI 시대, 인간의 미래",
    authorName: "유발 하라리",
    category: "과학",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    createdAt: "2025-07-01T14:30:00",
    todayCount: 18,
    totalCount: 45
  },
  {
    id: "sample-business-1",
    title: "부의 추월차선 2025",
    authorName: "MJ 드마코",
    category: "경제/경영",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    createdAt: "2025-06-28T11:15:00",
    todayCount: 12,
    totalCount: 38
  },
  {
    id: "sample-self-1",
    title: "불안한 마음에 건네는 위로",
    authorName: "알랭 드 보통",
    category: "자기계발",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    createdAt: "2025-06-20T16:45:00",
    todayCount: 8,
    totalCount: 28
  },
  {
    id: "sample-history-1",
    title: "세계사를 바꾼 10가지 혁명",
    authorName: "하워드 진",
    category: "역사",
    imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    createdAt: "2025-06-10T10:20:00",
    todayCount: 5,
    totalCount: 25
  },
  
  // 소설 부문
  {
    id: "sample-novel-1",
    title: "달러구트 꿈 백화점 3",
    authorName: "이미예",
    category: "소설",
    imageUrl: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=400&fit=crop",
    createdAt: "2025-07-03T13:00:00",
    todayCount: 20,
    totalCount: 48
  },
  {
    id: "sample-essay-1",
    title: "고요할수록 밝아지는 것들",
    authorName: "혜민스님",
    category: "시/에세이",
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    createdAt: "2025-06-25T08:30:00",
    todayCount: 10,
    totalCount: 32
  },
  {
    id: "sample-novel-2",
    title: "7년의 밤",
    authorName: "정유정",
    category: "소설",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=400&fit=crop",
    createdAt: "2025-05-15T12:45:00",
    todayCount: 7,
    totalCount: 42
  },
  
  // 자기계발 & 경영
  {
    id: "sample-self-2",
    title: "아무튼 출근",
    authorName: "김예란",
    category: "자기계발",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop",
    createdAt: "2025-06-05T15:20:00",
    todayCount: 11,
    totalCount: 31
  },
  {
    id: "sample-business-2",
    title: "조직의 미래, 플랫폼의 힘",
    authorName: "제프리 파커",
    category: "경제/경영",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
    createdAt: "2025-05-28T09:15:00",
    todayCount: 6,
    totalCount: 26
  },
  
  // 과학 & 기술
  {
    id: "sample-science-2",
    title: "퀀텀 컴퓨팅의 시대",
    authorName: "존 프레스킬",
    category: "과학",
    imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=300&h=400&fit=crop",
    createdAt: "2025-06-12T14:00:00",
    todayCount: 9,
    totalCount: 29
  },
  {
    id: "sample-science-3",
    title: "기후변화의 과학적 진실",
    authorName: "마이클 만",
    category: "과학",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop",
    createdAt: "2025-05-20T11:30:00",
    todayCount: 4,
    totalCount: 24
  },
  
  // 문학/예술
  {
    id: "sample-art-1",
    title: "K-문화의 글로벌 스토리",
    authorName: "김상헌",
    category: "문학/예술",
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=400&fit=crop",
    createdAt: "2025-06-18T16:20:00",
    todayCount: 13,
    totalCount: 33
  },
  
  // 사회/정치
  {
    id: "sample-social-1",
    title: "MZ세대가 바꾸는 대한민국",
    authorName: "송길영",
    category: "사회/정치",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    createdAt: "2025-05-25T13:45:00",
    todayCount: 16,
    totalCount: 36
  },
  
  // 인물
  {
    id: "sample-bio-1",
    title: "일론 머스크: 화성까지의 여정",
    authorName: "월터 아이작슨",
    category: "인물",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    createdAt: "2025-06-22T10:00:00",
    todayCount: 14,
    totalCount: 34
  },
  
  // 가정/생활
  {
    id: "sample-life-1",
    title: "미니멀 라이프의 기술",
    authorName: "마리 콘도",
    category: "가정/생활",
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    createdAt: "2025-05-30T14:30:00",
    todayCount: 5,
    totalCount: 25
  },
  
  // 청소년
  {
    id: "sample-teen-1",
    title: "꿈을 현실로 만드는 10대의 힘",
    authorName: "정재승",
    category: "청소년",
    imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    createdAt: "2025-06-08T09:45:00",
    todayCount: 8,
    totalCount: 28
  },
  
  // 어린이
  {
    id: "sample-child-1",
    title: "지구를 지키는 작은 영웅들",
    authorName: "김효은",
    category: "어린이",
    imageUrl: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=400&fit=crop",
    createdAt: "2025-06-14T15:15:00",
    todayCount: 3,
    totalCount: 23
  },
  
  // 국어/외국어
  {
    id: "sample-lang-1",
    title: "네이티브처럼 영어하기",
    authorName: "데이브 스펙터",
    category: "국어/외국어",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=400&fit=crop",
    createdAt: "2025-05-18T11:00:00",
    todayCount: 7,
    totalCount: 27
  },
  
  // 영어 오디오북
  {
    id: "sample-audio-1",
    title: "English Conversation Master",
    authorName: "Rachel Kim",
    category: "영어 오디오북",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop",
    createdAt: "2025-06-02T12:30:00",
    todayCount: 9,
    totalCount: 29
  },
  
  // 웹소설
  {
    id: "sample-web-1",
    title: "던전 마스터의 귀환",
    authorName: "김판타지",
    category: "웹소설",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
    createdAt: "2025-07-02T18:00:00",
    todayCount: 19,
    totalCount: 47
  },
  {
    id: "sample-web-2",
    title: "현대 판타지: 서울의 마법사",
    authorName: "이현대",
    category: "웹소설",
    imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=300&h=400&fit=crop",
    createdAt: "2025-06-30T20:15:00",
    todayCount: 17,
    totalCount: 43
  },
  
  // 종교
  {
    id: "sample-religion-1",
    title: "현대인을 위한 불교 명상",
    authorName: "법륜스님",
    category: "종교",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop",
    createdAt: "2025-05-12T07:30:00",
    todayCount: 6,
    totalCount: 26
  }
]; 