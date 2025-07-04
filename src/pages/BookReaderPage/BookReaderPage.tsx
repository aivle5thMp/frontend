import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { bookService } from '../../services/bookService';
import BookReader from '../../components/BookReader/BookReader';
import './BookReaderPage.css';

interface BookReadResponse {
  book_id: string;
  title: string;
  author_name: string;
  category: string;
  image_url: string;
  audio_url?: string;
  content: string;
  created_at: string;
}

const BookReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookData, setBookData] = useState<BookReadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchBookData = async () => {
      if (!bookId) return;

      try {
        setIsLoading(true);
        console.log('[BookReader] API 요청 시작:', bookId);
        const response = await bookService.getBookRead(bookId);
        console.log('[BookReader] API 응답 데이터:', response);
        setBookData(response);
        setError(null);
      } catch (err) {
        console.error('책 데이터 로딩 실패:', err);
        setError('책을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
  }, [bookId, isAuthenticated, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="book-reader-page loading">
        <p>책을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="book-reader-page error">
        <p>{error || '책을 찾을 수 없습니다.'}</p>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    );
  }

  console.log('[BookReader] BookReader 컴포넌트에 전달되는 데이터:', {
    id: bookData.book_id,
    title: bookData.title,
    authorName: bookData.author_name,
    category: bookData.category,
    imageUrl: bookData.image_url,
    audioUrl: bookData.audio_url
  });

  return (
    <BookReader
      book={{
        id: bookData.book_id,
        title: bookData.title,
        authorName: bookData.author_name,
        category: bookData.category,
        imageUrl: bookData.image_url,
        audioUrl: bookData.audio_url
      }}
      content={bookData.content}
      onClose={handleClose}
    />
  );
};

export default BookReaderPage; 