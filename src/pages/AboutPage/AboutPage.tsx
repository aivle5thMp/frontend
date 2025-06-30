import React, { useEffect, useRef, useState } from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = [heroRef, aboutRef, servicesRef, teamRef];
    sections.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const services = [
    {
      icon: "📚",
      title: "전자책 서비스",
      description: "다양한 장르의 고품질 전자책을 편리하게 이용할 수 있습니다. 언제 어디서나 독서의 즐거움을 만끽하세요."
    },
    {
      icon: "✨",
      title: "프리미엄 혜택",
      description: "구독자만의 특별한 혜택과 할인, 독점 콘텐츠를 제공합니다. 더 풍부한 독서 경험을 누리세요."
    },
    {
      icon: "🎯",
      title: "맞춤형 추천",
      description: "AI 기반 추천 시스템으로 당신의 취향에 맞는 책을 찾아드립니다. 새로운 작품과의 만남을 경험하세요."
    },
    {
      icon: "🌐",
      title: "크로스 플랫폼",
      description: "모바일, 태블릿, 데스크톱 어디서나 동일한 독서 경험을 제공합니다. 끊김 없는 독서 라이프스타일을 만들어보세요."
    }
  ];

  const teamMembers = [
    { name: "기획팀", role: "서비스 기획 및 UX 설계", description: "사용자 중심의 서비스를 기획하고 최적의 경험을 설계합니다" },
    { name: "개발팀", role: "프론트엔드 & 백엔드 개발", description: "안정적이고 확장 가능한 서비스를 구축합니다" },
    { name: "디자인팀", role: "UI/UX 디자인", description: "직관적이고 아름다운 인터페이스를 디자인합니다" },
    { name: "마케팅팀", role: "브랜딩 & 마케팅", description: "브랜드 가치를 전달하고 사용자와 소통합니다" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        id="hero"
        className={`hero-section ${isVisible.hero ? 'animate-in' : ''}`}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="highlight">Chapt12</span>와 함께하는
              <br />새로운 독서 경험
            </h1>
            <p className="hero-subtitle">
              에이블 스쿨 12조가 만든 혁신적인 전자책 플랫폼으로
              <br />언제 어디서나 원하는 책을 만나보세요
            </p>
            <div className="hero-buttons">
              <button className="cta-button primary">서비스 둘러보기</button>
              <button className="cta-button secondary">더 알아보기</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-books">
              <div className="book book-1">📖</div>
              <div className="book book-2">📚</div>
              <div className="book book-3">📓</div>
              <div className="book book-4">📔</div>
              <div className="book book-5">📕</div>
              <div className="book book-6">📗</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={aboutRef}
        id="about"
        className={`about-section ${isVisible.about ? 'animate-in' : ''}`}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">에이블 스쿨 12조를 소개합니다</h2>
            <p className="section-subtitle">
              다양한 전문성을 가진 팀원들이 모여 최고의 서비스를 만들어갑니다
            </p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>우리의 미션</h3>
              <p>
                디지털 시대에 맞는 새로운 독서 문화를 만들고, 모든 사람이 
                언제 어디서나 편리하게 책을 읽을 수 있는 환경을 제공합니다.
              </p>
              <h3>우리의 비전</h3>
              <p>
                기술과 콘텐츠가 만나 창조되는 가치를 통해 독서의 경계를 넓히고, 
                더 많은 사람들이 지식과 감동을 나눌 수 있는 플랫폼이 되겠습니다.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">7</div>
                <div className="stat-label">팀 구성원</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">개발 시간</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">∞</div>
                <div className="stat-label">열정과 아이디어</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        ref={servicesRef}
        id="services"
        className={`services-section ${isVisible.services ? 'animate-in' : ''}`}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">제공하는 서비스</h2>
            <p className="section-subtitle">
              사용자 중심의 혁신적인 기능들로 최고의 독서 경험을 선사합니다
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section 
        ref={teamRef}
        id="team"
        className={`team-section ${isVisible.team ? 'animate-in' : ''}`}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">우리 팀</h2>
            <p className="section-subtitle">
              각 분야의 전문가들이 하나의 목표를 향해 함께 달려갑니다
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="team-avatar">
                  <div className="avatar-placeholder">👥</div>
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 