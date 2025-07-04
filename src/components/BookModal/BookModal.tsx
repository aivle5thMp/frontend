import React, { useState, useEffect } from 'react';
import type { BookDetailResponse } from '../../types/book';
import { bookService } from '../../services/bookService';
import { purchaseService } from '../../services/purchaseService';
import { useAuth } from '../../hooks/useAuth';
import './BookModal.css';

interface BookModalProps {
  bookDetail: BookDetailResponse;
  isOpen: boolean;
  onClose: () => void;
  onReadBook?: (bookId: string) => void;
  onPurchase?: (bookId: string) => void;
}

const BookModal: React.FC<BookModalProps> = ({
  bookDetail,
  isOpen,
  onClose,
  onReadBook,
  onPurchase
}) => {
  const [isPurchased, setIsPurchased] = useState(false);
  const [pointBalance, setPointBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const isSampleBook = bookDetail?.bookId ? bookDetail.bookId.startsWith('sample-') : false;
  const isSubscribed = user?.isSubscribed || false;

  useEffect(() => {
    if (isOpen && isAuthenticated && !isSampleBook && bookDetail?.bookId) {
      checkPurchaseStatus();
      fetchPointBalance();
    } else {
      setLoading(false);
    }
  }, [isOpen, bookDetail?.bookId]);

  const checkPurchaseStatus = async () => {
    if (!bookDetail?.bookId) return;
    
    try {
      console.log('[Purchase Check] 구매 확인 시작:', bookDetail.bookId);
      const response = await bookService.checkPurchase(bookDetail.bookId);
      console.log('[Purchase Check] 구매 확인 결과:', response);
      setIsPurchased(response.is_purchased);
    } catch (err) {
      console.error('[Purchase Check] 구매 확인 실패:', err);
      setIsPurchased(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointBalance = async () => {
    try {
      const balance = await purchaseService.getPointBalance();
      setPointBalance(balance.totalPoint);
    } catch (err) {
      console.error('[Point Balance] 포인트 잔액 조회 실패:', err);
    }
  };

  const handleReadBook = () => {
    if (!bookDetail?.bookId || !onReadBook) return;
    
    onClose(); // 모달을 먼저 닫고
    onReadBook(bookDetail.bookId); // 부모 컴포넌트의 콜백 사용
  };

  const handlePurchase = async () => {
    if (!bookDetail?.bookId || !onPurchase) return;

    try {
      // 구독자는 포인트 소모 없이 구매 가능
      const requiredPoint = isSubscribed ? 0 : bookDetail.point;

      // 구독자가 아니고 포인트가 부족한 경우 구매 불가
      if (!isSubscribed && pointBalance < requiredPoint) {
        alert('포인트가 부족합니다.');
        return;
      }

      const response = await bookService.purchaseBook({
        bookId: bookDetail.bookId,
        point: requiredPoint,
        title: bookDetail.title,
        authorName: bookDetail.authorName,
        category: bookDetail.category,
        imageUrl: bookDetail.imageUrl
      });

      if (response.message && !response.message.includes('실패') && !response.message.includes('오류')) {
        setIsPurchased(true);
        alert('구매가 완료되었습니다!');
        onPurchase(bookDetail.bookId);
      } else {
        console.error('[Purchase] 구매 실패:', response.message);
        alert('구매에 실패했습니다. ' + (response.message || ''));
      }
    } catch (error: any) {
      console.error('[Purchase] 구매 오류:', error);
      alert('구매 처리 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  if (!isOpen) return null;

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="book-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="book-modal-body">
          {/* 왼쪽: 북커버 이미지 */}
          <div className="book-modal-image">
            <img src={bookDetail.imageUrl} alt={bookDetail.title} />
            {isSampleBook && <div className="sample-badge">샘플</div>}
          </div>

          {/* 오른쪽: 메타데이터 */}
          <div className="book-modal-info">
            <div className="book-modal-header">
              <span className="book-category">{bookDetail.category}</span>
              <h2 className="book-title">{bookDetail.title}</h2>
              <p className="book-author">{bookDetail.authorName}</p>
            </div>

            <div className="book-modal-stats">
              {!isSampleBook && !isPurchased && (
                <div className="stat-item point">
                  <span className="stat-label">필요 포인트 💰</span>
                  {isSubscribed ? (
                    <div className="point-info">
                      <span className="stat-value point-free">0P</span>
                      <span className="subscription-notice">(구독 혜택 적용)</span>
                    </div>
                  ) : (
                    <span className="stat-value point-required">{formatNumber(bookDetail?.point || 0)}P</span>
                  )}
                </div>
              )}
              {isAuthenticated && !isSampleBook && !isSubscribed && !isPurchased && (
                <div className="stat-item balance">
                  <span className="stat-label">보유 포인트 👝</span>
                  <span className={`stat-value ${pointBalance >= (bookDetail?.point || 0) ? 'point-sufficient' : 'point-insufficient'}`}>
                    {formatNumber(pointBalance)}P
                  </span>
                </div>
              )}
              <div className="stat-item date">
                <span className="stat-label">출간일</span>
                <span className="stat-value">{formatDate(bookDetail?.createdAt || '')}</span>
              </div>
              <div className="stat-item today">
                <span className="stat-label">오늘 조회</span>
                <span className="stat-value">{formatNumber(bookDetail?.todayCount || 0)}</span>
              </div>
              <div className="stat-item total">
                <span className="stat-label">총 조회</span>
                <span className="stat-value">{formatNumber(bookDetail?.totalCount || 0)}</span>
              </div>
            </div>

            <div className="book-modal-summary">
              <h3>줄거리</h3>
              <p>{bookDetail.summary}</p>
            </div>

            <div className="book-modal-actions">
              {isSampleBook ? (
                <div className="sample-notice">
                  샘플 도서입니다
                </div>
              ) : !isAuthenticated ? (
                <button className="btn-login" onClick={() => window.location.href = '/auth'}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  로그인하기
                </button>
              ) : loading ? (
                <div className="loading-text">확인 중...</div>
              ) : isPurchased ? (
                <button className="btn-read" onClick={handleReadBook}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  읽기 시작
                </button>
              ) : (
                <button 
                  className="btn-purchase" 
                  onClick={handlePurchase}
                  disabled={!isSubscribed && pointBalance < (bookDetail?.point || 0)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20ZM17 18C15.9 18 15 18.9 15 20C15 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L21.16 4.96L19.42 4H19.41L18.31 6L15.55 11H8.53L8.4 10.73L6.16 6L5.21 4L4.27 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isSubscribed ? '무료로 구매하기' : '구매하기'}
                  {!isSubscribed && pointBalance < (bookDetail?.point || 0) && (
                    <span className="insufficient-point">
                      (포인트 부족)
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
