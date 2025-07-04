import React from 'react';
import BookCard from '../BookCard';
import type { BookCardData } from '../../types/book';
import './BookRecommend.css';

interface BookRecommendProps {
  monthlyBooks: BookCardData[];
  trendingBooks: BookCardData[];
  onBookClick: (bookId: string) => void;
}

const BookRecommend: React.FC<BookRecommendProps> = ({ monthlyBooks, trendingBooks, onBookClick }) => {
  return (
    <section className="book-section">
      {/* 이달의 추천 도서 - 스핀 캐러셀 */}
      <div className="book-subsection monthly-section">
        <div className="section-header">
          <div className="section-title-area">
            <h2 className="section-title">
              📚 이달의 추천 도서
              <span className="title-decoration">MONTHLY PICKS</span>
            </h2>
          </div>
          <button className="view-all-btn">전체보기 →</button>
        </div>
        <div className="book-carousel">
          <div className="carousel-track monthly-track">
            {/* 원본 책들 */}
            {monthlyBooks.map((book) => (
              <div key={book.id} className="carousel-item">
                <BookCard
                  id={book.id}
                  title={book.title}
                  authorName={book.authorName}
                  category={book.category}
                  imageUrl={book.imageUrl}
                  size="medium"
                  createdAt={book.createdAt}
                  onClick={onBookClick}
                />
              </div>
            ))}
            {/* 무한 스크롤을 위한 복사본 */}
            {monthlyBooks.map((book) => (
              <div key={`copy-${book.id}`} className="carousel-item">
                <BookCard
                  id={book.id}
                  title={book.title}
                  authorName={book.authorName}
                  category={book.category}
                  imageUrl={book.imageUrl}
                  size="medium"
                  createdAt={book.createdAt}
                  onClick={onBookClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인기 급상승 - 미들크기 5개 일렬 */}
      <div className="book-subsection trending-section">
        <div className="section-header">
          <div className="section-title-area">
            <h2 className="section-title">
              🔥 인기 급상승
              <span className="title-decoration">TRENDING NOW</span>
            </h2>
          </div>
          <button className="view-all-btn">전체보기 →</button>
        </div>
        <div className="trending-grid">
          {trendingBooks.slice(0, 5).map((book, index) => (
            <div 
              key={book.id} 
              className="trending-card"
              onClick={() => onBookClick(book.id)}
            >
              <div className="trending-rank">
                <span className="rank-number">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📈'}
                </span>
              </div>
              <div className="trending-content">
                <img src={book.imageUrl} alt={book.title} className="trending-image" />
                <div className="trending-info">
                  <h3 className="trending-title">{book.title}</h3>
                  <p className="trending-author">{book.authorName}</p>
                  <span className="trending-category">{book.category}</span>
                </div>
              </div>
              <div className="trending-stats">
                <div className="views-count">
                  <span className="views-icon">👁️</span>
                  <span className="views-text">{book.totalCount.toLocaleString()}</span>
                </div>
                <div className="today-count">
                  <span className="today-icon">🔥</span>
                  <span className="today-text">오늘 {book.todayCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookRecommend; 