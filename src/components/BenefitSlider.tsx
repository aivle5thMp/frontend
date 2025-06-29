import React, { useState } from 'react';
import BenefitCard from './BenefitCard';
import '../styles/BenefitSlider.css';

const BenefitSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const benefits = [
    {
      title: "말이 바뀌면",
      subtitle: "당신의 인생이 바뀝니다",
      description: "지금 바로 책읽기 가능한\n현실 기반 말하기 가이드",
      backgroundColor: "#d63384",
      textColor: "white"
    },
    {
      title: "4인의 퇴마사",
      subtitle: "악을 쫓아 세계로",
      description: "퇴마와 국내편이 아이\n더를 시리즈가 찾아갑니다",
      backgroundColor: "#198754",
      textColor: "white"
    },
    {
      title: "대학의 기술",
      subtitle: "성공적인 대학생활을 위한 필수 가이드",
      description: "학업부터 인간관계까지\n대학생활의 모든 것",
      backgroundColor: "#0d6efd",
      textColor: "white"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % benefits.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="benefit-slider">
      <div className="slider-container">
        <button className="slider-btn prev-btn" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="slider-content">
          <div 
            className="slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
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