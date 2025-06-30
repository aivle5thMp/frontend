import React, { useState, useEffect, useRef, useCallback } from 'react';
import BenefitCard from '../BenefitCard/BenefitCard';
import './BenefitSlider.css';

interface Benefit {
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  badge?: string;
  ctaText: string;
  icon?: string;
}

const BenefitSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const benefits: Benefit[] = [
    {
      icon: "🎉",
      badge: "신규 회원 혜택",
      title: "첫 달 무료!",
      subtitle: "프리미엄 독서 플랜 체험하기",
      description: "무제한 도서 액세스 + AI 독서 가이드\n지금 가입하면 첫 30일 완전 무료",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "white",
      ctaText: "무료로 시작하기"
    },
    {
      icon: "⚡",
      badge: "한정 특가",
      title: "연간 플랜 50% 할인",
      subtitle: "올해만 특별가 제공!",
      description: "월 14,900원 → 7,450원\n1년 구독 시 무려 89,400원 절약",
      backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textColor: "white",
      ctaText: "특가로 구독하기"
    },
    {
      icon: "🏆",
      badge: "베스트셀러",
      title: "이번 주 TOP 10",
      subtitle: "가장 많이 읽힌 인기 도서",
      description: "실시간 랭킹 1위부터 10위까지\n트렌드에 맞는 최신 도서들을 만나보세요",
      backgroundColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      textColor: "white",
      ctaText: "랭킹 보러가기"
    },
    {
      icon: "📚",
      badge: "신간 출시",
      title: "AI 시대 필독서",
      subtitle: "ChatGPT 활용 완전 가이드",
      description: "개발자를 위한 AI 도구 활용법\n업무 효율 10배 높이는 실전 노하우",
      backgroundColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      textColor: "white",
      ctaText: "신간 읽어보기"
    },
    {
      icon: "🎯",
      badge: "맞춤 추천",
      title: "내게 딱 맞는 책",
      subtitle: "AI가 분석한 개인 맞춤 도서",
      description: "독서 취향과 관심사를 분석하여\n당신만을 위한 도서를 추천해드립니다",
      backgroundColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      textColor: "#2d3748",
      ctaText: "맞춤 추천 받기"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % benefits.length);
  }, [benefits.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + benefits.length) % benefits.length);
  }, [benefits.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // 마우스 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setAutoPlay(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    setTranslateX(deltaX);
  }, [isDragging, startX]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }

    // 드래그 거리에 따라 슬라이드 변경
    const threshold = 100; // 최소 드래그 거리
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setTranslateX(0);
    
    // 잠시 후 자동재생 재개
    setTimeout(() => {
      setAutoPlay(true);
    }, 3000);
  }, [isDragging, translateX, nextSlide, prevSlide]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    setIsDragging(true);
    setStartX(touch.clientX);
    setAutoPlay(false);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches?.[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - startX;
    setTranslateX(deltaX);
  }, [isDragging, startX]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);

    const threshold = 50;
    
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setTranslateX(0);
    
    setTimeout(() => {
      setAutoPlay(true);
    }, 3000);
  }, [isDragging, translateX, nextSlide, prevSlide]);

  // 마우스 이벤트 리스너
  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
    const handleMouseUpGlobal = () => handleMouseUp();
    const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
    const handleTouchEndGlobal = () => handleTouchEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      document.addEventListener('touchmove', handleTouchMoveGlobal);
      document.addEventListener('touchend', handleTouchEndGlobal);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
      document.removeEventListener('touchmove', handleTouchMoveGlobal);
      document.removeEventListener('touchend', handleTouchEndGlobal);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // 자동재생
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, nextSlide]);

  // 슬라이더 호버 시 자동재생 일시정지
  const handleSliderMouseEnter = () => {
    setAutoPlay(false);
  };

  const handleSliderMouseLeave = () => {
    if (!isDragging) {
      setAutoPlay(true);
    }
  };

  const slideTransform = `translateX(${-currentSlide * 100 + (translateX / (sliderRef.current?.offsetWidth || 1)) * 100}%)`;

  return (
    <div className="benefit-slider">
      <div 
        className="slider-container"
        onMouseEnter={handleSliderMouseEnter}
        onMouseLeave={handleSliderMouseLeave}
      >
        <button className="slider-btn prev-btn" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div 
          className="slider-content"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div 
            className="slider-track"
            ref={trackRef}
            style={{ 
              transform: slideTransform,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="slide">
                <BenefitCard {...benefit} />
              </div>
            ))}
          </div>
        </div>
        
        <button className="slider-btn next-btn" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="slider-dots">
        {benefits.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BenefitSlider; 