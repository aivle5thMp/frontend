import React from 'react';
import BookCard from './BookCard';
import '../styles/BookSection.css';

const BookSection: React.FC = () => {
  const books = [
    {
      title: "소망의 시작",
      author: "김지은",
      category: "자기계발",
      rating: 4,
      backgroundColor: "#ffc107",
      textColor: "#333",
      badge: "2025.06 신작"
    },
    {
      title: "잠자는 숲의 무덤",
      author: "이한나",
      category: "판타지",
      rating: 5,
      backgroundColor: "#28a745",
      textColor: "white",
      badge: "2025.06 신작"
    },
    {
      title: "함께 하는 낯짐",
      author: "박성민",
      category: "소설",
      rating: 4,
      backgroundColor: "#6f42c1",
      textColor: "white"
    },
    {
      title: "역사의 속삭임",
      author: "최영수",
      category: "역사",
      rating: 5,
      backgroundColor: "#fd7e14",
      textColor: "white"
    },
    {
      title: "깊은 바다의 비밀",
      author: "정미래",
      category: "미스터리",
      rating: 4,
      backgroundColor: "#20c997",
      textColor: "white"
    },
    {
      title: "마음의 소리",
      author: "강지훈",
      category: "에세이",
      rating: 5,
      backgroundColor: "#dc3545",
      textColor: "white"
    },
    {
      title: "별이 빛나는 밤에",
      author: "윤서영",
      category: "로맨스",
      rating: 4,
      backgroundColor: "#e83e8c",
      textColor: "white"
    },
    {
      title: "시간을 걷는 사람",
      author: "남태현",
      category: "SF",
      rating: 5,
      backgroundColor: "#6610f2",
      textColor: "white"
    },
    {
      title: "작은 행복들",
      author: "이수진",
      category: "힐링",
      rating: 4,
      backgroundColor: "#17a2b8",
      textColor: "white"
    }
  ];

  return (
    <section className="book-section">
      <div className="book-section-container">
        <div className="section-header">
          <h2 className="section-title">오늘의 오디오북</h2>
          <p className="section-subtitle">새로운 이야기와 함께하는 특별한 시간</p>
        </div>
        
        <div className="book-grid">
          {books.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection; 