import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './PlusPage.css';

const PlusPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    // TODO: 구독 결제 처리
    console.log('구독 신청 처리');
  };

  const features = [
    {
      icon: '🎧',
      title: '오디오북 무제한',
      description: '이동 중에도 책을 들을 수 있어요'
    },
    {
      icon: '💎',
      title: '프리미엄 컨텐츠',
      description: '작가님의 특별한 이야기를 만나보세요'
    },
    {
      icon: '📱',
      title: '멀티 디바이스',
      description: '모든 기기에서 이용 가능해요'
    }
  ];

  return (
    <div className="plus-page">
      <div className="plus-header">
        <h1>Chapt12 멤버십</h1>
        <p>오디오 북으로 풍부한 스토리 텔링을 경험해보세요.</p>
      </div>

      {user?.isSubscribed ? (
        // 구독 중인 경우
        <div className="subscription-status">
          <div className="status-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">현재 구독 중</span>
          </div>
          <div className="subscription-info">
            <h2>Chapt12 Plus 멤버십</h2>
            <p>모든 프리미엄 기능을 자유롭게 이용하실 수 있습니다.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 미구독 상태인 경우
        <div className="subscription-plans">
          <div className="plan-card">
            <div className="plan-header">
              <h2>Chapt12 Plus</h2>
              <div className="plan-price">
                <span className="price">9,900</span>
                <span className="unit">원/월</span>
              </div>
            </div>
            
            <div className="plan-features">
              {features.map((feature, index) => (
                <div key={index} className="plan-feature-item">
                  <span className="feature-icon">{feature.icon}</span>
                  <div className="feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="subscribe-button" onClick={handleSubscribe}>
              구독 시작하기
            </button>

            <p className="plan-note">
              * 언제든지 해지 가능하며, 다음 결제일에 자동으로 구독이 종료됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlusPage; 