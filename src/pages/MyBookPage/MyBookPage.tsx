import React, { useState } from 'react';
import BookCard from '../../components/BookCard';
import './MyBookPage.css';

interface Book {
  id: number;
  title: string;
  author_name: string;
  category: string;
  image_url: string;
  createdAt: string;
  purchaseDate: string;
}

const categories = [
  '전체',
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

// 구매한 책들 (샘플 데이터)
const purchasedBooks: Book[] = [
  {
    id: 1,
    title: "대화의 기술",
    author_name: "데일 카네기",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    createdAt: "2025-06-25",
    purchaseDate: "2025-01-15"
  },
  {
    id: 3,
    title: "동양의 시간으로 더 깊어진 인문학적 통찰",
    author_name: "이동양",
    category: "시/에세이",
    image_url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    createdAt: "2025-06-30",
    purchaseDate: "2025-01-10"
  },
  {
    id: 5,
    title: "더 퍼스트",
    author_name: "김퍼스트",
    category: "경제/경영",
    image_url: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=400&fit=crop",
    createdAt: "2025-06-15",
    purchaseDate: "2025-01-08"
  },
  {
    id: 8,
    title: "생각하는 대로 그렇게 된다",
    author_name: "정생각",
    category: "자기계발",
    image_url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
    createdAt: "2025-05-15",
    purchaseDate: "2025-01-05"
  },
  {
    id: 11,
    title: "그들은 어떻게 영어 1등급을 받았나",
    author_name: "박영어",
    category: "영어 오디오북",
    image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=400&fit=crop",
    createdAt: "2025-05-01",
    purchaseDate: "2025-01-03"
  },
  {
    id: 15,
    title: "어린왕자",
    author_name: "생텍쥐페리",
    category: "소설",
    image_url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
    createdAt: "2025-04-10",
    purchaseDate: "2025-01-01"
  }
];

const MyBookPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredBooks = (() => {
    if (activeCategory === '전체') {
      return purchasedBooks;
    }
    
    return purchasedBooks.filter(book => book.category === activeCategory);
  })();

  return (
    <div className="my-book-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">마이북</h1>
          <p className="page-subtitle">구매한 책 {purchasedBooks.length}권</p>
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
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-grid-item">
                <BookCard
                  title={book.title}
                  author_name={book.author_name}
                  category={book.category}
                  image_url={book.image_url}
                  createdAt={book.createdAt}
                />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>해당 카테고리에 구매한 책이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookPage;
