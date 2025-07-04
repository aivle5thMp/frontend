import React, { useState, useEffect } from 'react';
import BenefitSlider from '../../components/BenefitSlider/BenefitSlider';
import BookRecommend from '../../components/BookRecommend/BookRecommend';
import BookSection from '../../components/BookSection/BookSection';
import BookModal from '../../components/BookModal/BookModal';
import type { BookLists, BookDetailResponse } from '../../types/book';
import { allBooksData } from '../../data/booksData'; // 임시 데이터
import { bookService } from '../../services/bookService';
import { processBookData } from '../../utils/bookAlgorithms';
import { transformToBookDetailResponse, transformToBookCardDataList } from '../../utils/bookDataTransform';
import '../../components/BookModal/BookModal.css'; // BookModal CSS 가져오기
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [bookLists, setBookLists] = useState<BookLists>({
    monthlyBooks: [],
    trendingBooks: [],
    allBooks: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<BookDetailResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // 임시 데이터를 기본으로 시작
        let bookCardDataList = [...allBooksData];
        
        // 실제 API 호출해서 데이터 추가
        try {
          const apiResponse = await bookService.getBooks();
          console.log('API 응답:', apiResponse);
          
          // API 응답이 배열인지 객체인지 확인
          let apiBookItems = null;
          if (Array.isArray(apiResponse)) {
            // 직접 배열로 온 경우
            apiBookItems = apiResponse;
          } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
            // 객체로 온 경우 (BookListResponse 형태)
            apiBookItems = apiResponse.data;
          }
          
          if (apiBookItems && apiBookItems.length > 0) {
            const apiBookData = transformToBookCardDataList(apiBookItems);
            console.log('변환된 API 데이터:', apiBookData);
            // API 데이터를 임시 데이터에 append
            bookCardDataList = [...bookCardDataList, ...apiBookData];
          } else {
            console.warn('API 응답 데이터가 유효하지 않음:', apiResponse);
          }
        } catch (apiError) {
          console.warn('API 호출 실패, 임시 데이터만 사용:', apiError);
        }
        
        // 전체 책 데이터에 알고리즘 적용
        const processedData = processBookData(bookCardDataList);
        
        setBookLists(processedData);
      } catch (error) {
        console.error('책 데이터 가져오기 실패:', error);
        // 에러 발생 시 빈 데이터로 초기화
        setBookLists({
          monthlyBooks: [],
          trendingBooks: [],
          allBooks: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!selectedBookId) {
        setSelectedBookDetail(null);
        return;
      }

      // 더미 데이터인 경우 로컬 데이터 사용
      if (selectedBookId.startsWith('sample-')) {
        const allBooks = [
          ...bookLists.monthlyBooks,
          ...bookLists.trendingBooks,
          ...bookLists.allBooks
        ];
        const selectedBook = allBooks.find(book => book.id === selectedBookId);
        if (selectedBook) {
          setSelectedBookDetail(transformToBookDetailResponse(selectedBook));
        }
        return;
      }

      // 실제 API 호출
      try {
        const response = await bookService.getBookDetail(selectedBookId);
        setSelectedBookDetail(transformToBookDetailResponse(response));
      } catch (error) {
        console.error('책 상세 정보 가져오기 실패:', error);
        setSelectedBookDetail(null);
      }
    };

    fetchBookDetail();
  }, [selectedBookId]);

  const handleBookClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookId(null);
  };

  const handleReadBook = (bookId: string) => {
    console.log('읽기 시작:', bookId);
    navigate(`/read/${bookId}`);
  };

  const handlePurchase = (bookId: string) => {
    console.log('구매 완료:', bookId);
    // 구매 완료 후 모달 닫기
    handleCloseModal();
    // 필요한 경우 상태 업데이트나 리다이렉션 추가
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <div>데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <>
      <BenefitSlider />
      <BookRecommend 
        monthlyBooks={bookLists.monthlyBooks}
        trendingBooks={bookLists.trendingBooks}
        onBookClick={handleBookClick}
      />
      <BookSection 
        allBooks={bookLists.allBooks}
        onBookClick={handleBookClick}
      />
      
      {selectedBookDetail && (
        <BookModal
          bookDetail={selectedBookDetail}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onReadBook={handleReadBook}
          onPurchase={handlePurchase}
        />
      )}
    </>
  );
};

export default HomePage; 