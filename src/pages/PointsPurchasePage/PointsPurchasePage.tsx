import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { purchaseService } from '../../services/purchaseService';
import type { PointsPackage } from '../../types/purchase';
import './PointsPurchasePage.css';

const PointsPurchasePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (pointsPackage: PointsPackage) => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      const response = await purchaseService.purchasePoints(
        pointsPackage.finalPrice,
        pointsPackage.points
      );
      
      if (response.status === 'APPROVED' || response.status === 'SUCCESS' || response.status === 'COMPLETED') {
        alert(`포인트 구매가 완료되었습니다!\n구매 포인트: ${pointsPackage.points}P\n결제 금액: ${pointsPackage.finalPrice.toLocaleString()}원`);
        // 페이지 새로고침으로 포인트 업데이트
        window.location.reload();
      } else {
        alert('포인트 구매에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      alert(error.message || '포인트 구매 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  const pointsPackages = [
    {
      id: 1,
      points: 5000,
      originalPrice: 5000,
      finalPrice: 5000,
      discount: 0,
      badge: '',
      popular: false,
      icon: '💎',
      title: '스타터 패키지',
      description: '소설 감상을 시작해보세요',
      benefits: ['기본 오디오북 이용권', '소설 감상 포인트']
    },
    {
      id: 2,
      points: 10000,
      originalPrice: 10000,
      finalPrice: 9500,
      discount: 5,
      badge: '5% 할인',
      popular: true,
      icon: '🎯',
      title: '베스트셀러 패키지',
      description: '인기 작품들을 마음껏 즐기세요',
      benefits: ['프리미엄 오디오북 포함', '작가 팔로우 기능', '5% 할인 혜택']
    },
    {
      id: 3,
      points: 30000,
      originalPrice: 30000,
      finalPrice: 27000,
      discount: 10,
      badge: '10% 할인 + 보너스',
      popular: false,
      icon: '🚀',
      title: '프리미엄 패키지',
      description: '독서 마니아를 위한 최고 선택',
      benefits: ['모든 프리미엄 컨텐츠', '독점 선공개 작품', '10% 할인 + 2000 보너스 포인트']
    },
    {
      id: 4,
      points: 50000,
      originalPrice: 50000,
      finalPrice: 42500,
      discount: 15,
      badge: '15% 할인 + 대용량 보너스',
      popular: false,
      icon: '👑',
      title: 'VIP 패키지',
      description: '최고의 독서 경험을 제공합니다',
      benefits: ['모든 VIP 특전', '작가와의 만남 우선권', '15% 할인 + 5000 보너스 포인트', '전용 고객 지원']
    }
  ];

  return (
    <div className="points-purchase-page">
      <div className="purchase-header">
        <h1>포인트 충전</h1>
        <p>더 많은 스토리를 즐기기 위한 포인트를 충전하세요.</p>
        <div className="current-points">
          {isAuthenticated && user ? (
            <span>현재 보유 포인트: <strong>{userPoints}</strong> P</span>
          ) : (
            <span>로그인 후 포인트를 확인하실 수 있습니다</span>
          )}
        </div>
      </div>

      <div className="packages-grid">
        {pointsPackages.map((pkg) => (
          <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
            {pkg.popular && <div className="popular-badge">인기</div>}
            {pkg.badge && <div className="discount-badge">{pkg.badge}</div>}
            
            <div className="package-icon">{pkg.icon}</div>
            <h3 className="package-title">{pkg.title}</h3>
            <p className="package-description">{pkg.description}</p>
            
            <div className="package-points">
              <span className="points-amount">{pkg.points.toLocaleString()}</span>
              <span className="points-unit">포인트</span>
            </div>

            <div className="package-price">
              {pkg.discount > 0 && (
                <span className="original-price">{pkg.originalPrice.toLocaleString()}원</span>
              )}
              <div className="final-price">
                <span className="price">{pkg.finalPrice.toLocaleString()}</span>
                <span className="unit">원</span>
              </div>
              {pkg.discount > 0 && (
                <span className="discount-rate">{pkg.discount}% 할인</span>
              )}
            </div>

            <ul className="package-benefits">
              {pkg.benefits.map((benefit, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>

            <button 
              className="purchase-button" 
              onClick={() => handlePurchase(pkg)}
              disabled={isLoading}
            >
              {isLoading ? '구매 중...' : '구매하기'}
            </button>
          </div>
        ))}
      </div>

      <div className="purchase-info">
        <h3>포인트 이용 안내</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">📚</span>
            <div>
              <h4>다양한 컨텐츠</h4>
              <p>소설, 에세이, 시나리오 등 다양한 장르의 작품을 즐기세요</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎧</span>
            <div>
              <h4>오디오북 지원</h4>
              <p>포인트로 프리미엄 오디오북을 이용할 수 있습니다</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">💝</span>
            <div>
              <h4>작가 후원</h4>
              <p>좋아하는 작가에게 포인트로 직접 후원할 수 있습니다</p>
            </div>
          </div>
        </div>
        
        <div className="purchase-note">
          <p>* 구매한 포인트는 환불이 불가능하며, 계정 삭제 시 소멸됩니다.</p>
          <p>* 할인 혜택은 예고 없이 변경될 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PointsPurchasePage; 