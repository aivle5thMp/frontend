import React from 'react';
import BookCard from '../BookCard';
import './BookRecommend.css';

interface Book {
  id: number;
  title: string;
  author_name: string;
  category: string;
  image_url: string;
  isNew?: boolean;
  rating?: number;
  views?: string;
}

// 이달의 추천 도서 - 더 많은 책 추가
const monthlyBooks: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author_name: "Robert C. Martin",
    category: "Programming",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop"
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author_name: "David Thomas",
    category: "Software Development",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
  },
  {
    id: 3,
    title: "You Don't Know JS",
    author_name: "Kyle Simpson",
    category: "JavaScript",
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Design Patterns",
    author_name: "Gang of Four",
    category: "Architecture",
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Refactoring",
    author_name: "Martin Fowler",
    category: "Code Quality",
    image_url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Algorithms Unlocked",
    author_name: "Thomas H. Cormen",
    category: "Algorithm",
    image_url: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=300&h=400&fit=crop"
  },
  {
    id: 7,
    title: "System Design Primer",
    author_name: "Alex Xu",
    category: "System Design",
    image_url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop"
  },
  {
    id: 8,
    title: "Effective Java",
    author_name: "Joshua Bloch",
    category: "Java",
    image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=400&fit=crop"
  },
  {
    id: 9,
    title: "HTTP 완벽 가이드",
    author_name: "David Gourley",
    category: "Network",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop"
  },
  {
    id: 10,
    title: "Database Internals",
    author_name: "Alex Petrov",
    category: "Database",
    image_url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop"
  },
  {
    id: 11,
    title: "The Art of Computer Programming",
    author_name: "Donald E. Knuth",
    category: "Algorithm",
    image_url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=300&h=400&fit=crop"
  },
  {
    id: 12,
    title: "Operating Systems",
    author_name: "Abraham Silberschatz",
    category: "OS",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop"
  }
];



// 인기 급상승
const trendingBooks: Book[] = [
  {
    id: 25,
    title: "ChatGPT와 함께하는 개발",
    author_name: "김개발",
    category: "AI/ML",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop",
    views: "1.2k"
  },
  {
    id: 26,
    title: "Next.js 완전정복",
    author_name: "이프론트",
    category: "Frontend",
    image_url: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop",
    views: "856"
  },
  {
    id: 27,
    title: "Docker & Kubernetes",
    author_name: "박데브옵스",
    category: "DevOps",
    image_url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=300&h=400&fit=crop",
    views: "743"
  },
  {
    id: 28,
    title: "AWS 클라우드 실전",
    author_name: "최클라우드",
    category: "Cloud",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=400&fit=crop",
    views: "612"
  },
  {
    id: 29,
    title: "Python 데이터 분석",
    author_name: "정데이터",
    category: "Data Science",
    image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=400&fit=crop",
    views: "534"
  }
];

const BookSection: React.FC = () => {
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
                  title={book.title}
                  author_name={book.author_name}
                  category={book.category}
                  image_url={book.image_url}
                  size="medium"
                />
              </div>
            ))}
            {/* 무한 스크롤을 위한 복사본 */}
            {monthlyBooks.map((book) => (
              <div key={`copy-${book.id}`} className="carousel-item">
                <BookCard
                  title={book.title}
                  author_name={book.author_name}
                  category={book.category}
                  image_url={book.image_url}
                  size="medium"
                />
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* 인기 급상승 - 순위 리스트 형태 */}
      <div className="book-subsection trending-section">
        <div className="section-header">
          <div className="section-title-area">
            <h2 className="section-title">
              📈 요즘 다들 이거 읽어요
              <span className="title-decoration">TRENDING NOW</span>
            </h2>
          </div>
          <button className="view-all-btn">랭킹 전체보기 →</button>
        </div>
        <div className="trending-list">
          {trendingBooks.map((book, index) => (
            <div key={book.id} className="trending-item">
              <div className="rank-number">
                <span className={`rank ${index < 3 ? 'top-rank' : ''}`}>
                  {index + 1}
                </span>
              </div>
              <div className="book-thumbnail">
                <img src={book.image_url} alt={book.title} />
              </div>
              <div className="book-info">
                <h4 className="book-title">{book.title}</h4>
                <p className="book-author">{book.author_name}</p>
                <span className="book-category">{book.category}</span>
              </div>
              <div className="book-stats">
                <div className="views">
                  👁‍🗨 {book.views} 조회
                </div>
                <div className="trend-badge">
                  🔥 HOT
                </div>
              </div>
              <div className="trending-actions">
                <button className="quick-read-btn">읽기</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection; 