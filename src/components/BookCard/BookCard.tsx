import React from 'react';
import { isNewBook } from '../../utils/dateUtils';
import './BookCard.css';

interface BookCardProps {
  id?: string;
  authorName: string;
  title: string;
  category: string;
  imageUrl: string;
  size?: 'small' | 'medium' | 'large';
  createdAt?: string;
  onClick?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  authorName,
  imageUrl,
  category,
  size = 'medium',
  createdAt,
  onClick
}) => {
  const isNew = createdAt ? isNewBook(createdAt) : false;

  const handleClick = () => {
    if (onClick && id) {
      onClick(id);
    }
  };

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick && id) {
      onClick(id);
    }
  };

  return (
    <div className={`book-card book-card-${size}`} onClick={handleClick}>
      <div className="book-card-image">
        <img src={imageUrl} alt={title} loading="lazy" />
        {isNew && <div className="new-badge">NEW</div>}
        <div className="book-card-overlay">
          <button className="read-btn" onClick={handleReadClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            읽기
          </button>
        </div>
      </div>
      
      <div className="book-card-content">
        <div className="book-category">{category}</div>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{authorName}</p>
      </div>
    </div>
  );
};

export default BookCard; 