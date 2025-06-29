import React from 'react';
import '../styles/BookCard.css';

interface BookCardProps {
  title: string;
  author: string;
  category: string;
  rating: number;
  backgroundColor: string;
  textColor?: string;
  image?: string;
  badge?: string;
}

const BookCard: React.FC<BookCardProps> = ({ 
  title, 
  author, 
  category,
  rating,
  backgroundColor, 
  textColor = 'white',
  image,
  badge
}) => {
  return (
    <div 
      className="book-card" 
      style={{ 
        backgroundColor, 
        color: textColor 
      }}
    >
      {badge && (
        <div className="book-badge">{badge}</div>
      )}
      
      <div className="book-card-content">
        <div className="book-category">{category}</div>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        
        <div className="book-rating">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`star ${i < rating ? 'filled' : ''}`}
            >
              ★
            </span>
          ))}
          <span className="rating-text">{rating}.0</span>
        </div>
      </div>
      
      {image && (
        <div className="book-image">
          <img src={image} alt={title} />
        </div>
      )}
    </div>
  );
};

export default BookCard; 