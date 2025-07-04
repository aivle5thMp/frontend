import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import './MyBookPage.css';

interface MyBook {
  id: string;          // MyBook 엔티티의 ID
  userId: string;      // 구매한 사용자 UUID
  bookId: string;      // 구매한 도서 UUID
  title: string;       // 도서 제목
  authorName: string;  // 작가 이름
  category: string;    // 카테고리
  imageUrl: string;    // 표지 이미지 URL
  createdAt: string;   // 구매 일시
  point: number;       // 사용한 포인트
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

const MyBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('전체');
  const [purchasedBooks, setPurchasedBooks] = useState<MyBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        setIsLoading(true);
        const response = await bookService.getPurchaseHistory();
        setPurchasedBooks(response);
        setError(null);
      } catch (err) {
        setError('구매 이력을 불러오는데 실패했습니다.');
        console.error('구매 이력 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const handleBookClick = (bookId: string) => {
    navigate(`/read/${bookId}`);
  };

  const filteredBooks = activeCategory === '전체' 
    ? purchasedBooks 
    : purchasedBooks.filter(book => book.category === activeCategory);

  if (isLoading) {
    return (
      <div className="my-book-page">
        <div className="page-container">
          <div className="loading-state">
            <p>구매 이력을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-book-page">
        <div className="page-container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="my-books-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="my-book-item"
                onClick={() => handleBookClick(book.bookId)}
                role="button"
                tabIndex={0}
              >
                <div className="my-book-cover">
                  <img src={book.imageUrl} alt={book.title} />
                </div>
                <div className="my-book-info">
                  <span className="my-book-category">{book.category}</span>
                  <h3 className="my-book-title">{book.title}</h3>
                  <p className="my-book-author">{book.authorName}</p>
                  <time className="my-book-date">
                    {new Date(book.createdAt).toLocaleDateString()}
                  </time>
                </div>
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
