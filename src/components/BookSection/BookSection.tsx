import { useState } from 'react';
import BookCard from '../BookCard';
import type { BookCardData, BookCategory } from '../../types/book';
import { filterByCategory } from '../../utils/bookAlgorithms';
import './BookSection.css';

interface BookSectionProps {
  allBooks: BookCardData[];
  onBookClick: (bookId: string) => void;
}

const BookSection: React.FC<BookSectionProps> = ({ allBooks, onBookClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');

  const categories: (BookCategory | 'all')[] = [
    'all',
    '새로 나온 책',
    '소설',
    '시/에세이',
    '사회/정치',
    '과학',
    '역사',
    '경제/경영',
    '자기계발',
    '문학/예술',
    '인물',
    '가정/생활',
    '청소년',
    '어린이',
    '국어/외국어',
    '영어 오디오북',
    '웹소설',
    '종교'
  ];

  const getCategoryDisplayName = (category: BookCategory | 'all') => {
    if (category === 'all') return '전체';
    return category;
  };

  const filteredBooks = selectedCategory === 'all' 
    ? allBooks 
    : filterByCategory(allBooks, selectedCategory);

  return (
    <section className="book-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-title-area">
            <h2 className="section-title">
              📖 전체보기
              <span className="title-decoration">ALL BOOKS</span>
            </h2>
          </div>
        </div>

        <div className="category-filter">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </div>

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              authorName={book.authorName}
              category={book.category}
              imageUrl={book.imageUrl}
              size="small"
              createdAt={book.createdAt}
              onClick={onBookClick}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="no-books">
            <p>선택한 카테고리에 해당하는 도서가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection; 