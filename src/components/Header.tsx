import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav className="nav-menu">
            <a href="#" className="nav-item">소개</a>
            <a href="#" className="nav-item">기초</a>
            <a href="#" className="nav-item">전자책</a>
            <a href="#" className="nav-item">오디오북</a>
            <a href="#" className="nav-item">플러스</a>
          </nav>
        </div>
        
        <div className="logo">
          <span className="logo-text">알라</span>
          <span className="logo-version">3.0</span>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="저자, 책제목, 키워드 검색"
              className="search-input"
            />
            <button className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="auth-buttons">
            <button className="login-btn">알라 회원가입</button>
            <button className="signup-btn">B2B 문의</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 