import React, { useState } from 'react';
import BookCard from '../BookCard';
import { isNewBook } from '../../utils/dateUtils';
import './BookSection.css';

interface Book {
  id: number;
  title: string;
  author_name: string;
  category: string;
  image_url: string;
  createdAt: string;
}

const categories = [
  '전체',
  '새로 나온 책',
  '소설',
  '경제/경영',
  '자기계발',
  '인물',
  '역사',
  '시/에세이',
  '어린이',
  '종교',
  '국어/외국어',
  '사회/정치',
  '과학',
  '가정/생활',
  '문학/예술',
  '청소년',
  '유아',
  '영어 오디오북',
  '웹소설'
];

const allBooks: Book[] = [
  {
    id: 1,
    title: "대화의 기술",
    author_name: "데일 카네기",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    createdAt: "2025-06-25"
  },
  {
    id: 2,
    title: "인생을 바꾸는 대화의 기술",
    author_name: "김대화",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    createdAt: "2025-06-28"
  },
  {
    id: 3,
    title: "동양의 시간으로 더 깊어진 인문학적 통찰",
    author_name: "이동양",
    category: "시/에세이",
    image_url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    createdAt: "2025-06-30"
  },
  {
    id: 4,
    title: "불편함에 편안함을 느껴라",
    author_name: "박불편",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    createdAt: "2025-07-01"
  },
  {
    id: 5,
    title: "더 퍼스트",
    author_name: "김퍼스트",
    category: "경제/경영",
    image_url: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=400&fit=crop",
    createdAt: "2025-06-15"
  },
  {
    id: 6,
    title: "21세기를 살아가는 현대인을 위한 생각의 힘",
    author_name: "이생각",
    category: "문학/예술",
    image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=400&fit=crop",
    createdAt: "2025-06-10"
  },
  {
    id: 7,
    title: "바라는 용기 100",
    author_name: "최용기",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop",
    createdAt: "2025-05-20"
  },
  {
    id: 8,
    title: "생각하는 대로 그렇게 된다",
    author_name: "정생각",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
    createdAt: "2025-05-15"
  },
  {
    id: 9,
    title: "일류 경영자의 조건",
    author_name: "김일류",
    category: "경제/경영",
    image_url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=300&h=400&fit=crop",
    createdAt: "2025-05-10"
  },
  {
    id: 10,
    title: "호기심의 뇌과학",
    author_name: "이호기심",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop",
    createdAt: "2025-05-05"
  },
  {
    id: 11,
    title: "그들은 어떻게 영어 1등급을 받았나",
    author_name: "박영어",
    category: "영어 오디오북",
    image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=400&fit=crop",
    createdAt: "2025-05-01"
  },
  {
    id: 12,
    title: "결국 잘되는 사람들의 태도",
    author_name: "최잘됨",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    createdAt: "2025-04-25"
  },
  {
    id: 13,
    title: "말의 감각",
    author_name: "김말",
    category: "인물",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    createdAt: "2025-04-20"
  },
  {
    id: 14,
    title: "조선왕조실록",
    author_name: "사관",
    category: "역사",
    image_url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    createdAt: "2025-04-15"
  },
  {
    id: 15,
    title: "어린왕자",
    author_name: "생텍쥐페리",
    category: "소설",
    image_url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    createdAt: "2025-04-10"
  }
];

const BookSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredBooks = (() => {
    if (activeCategory === '전체') {
      return allBooks;
    }
    
    if (activeCategory === '새로 나온 책') {
      return allBooks.filter(book => isNewBook(book.createdAt));
    }
    
    return allBooks.filter(book => book.category === activeCategory);
  })();

  return (
    <section className="book-section">
      <div className="section-container">
        <div className="section-header">
          <h1 className="section-title">전체보기</h1>
        </div>
        
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-grid-item">
              <BookCard
                title={book.title}
                author_name={book.author_name}
                category={book.category}
                image_url={book.image_url}
                createdAt={book.createdAt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection; 