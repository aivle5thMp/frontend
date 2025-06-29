import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>알라 3.0</h3>
            <p>당신의 인생이 바뀝니다</p>
          </div>
          
          <div className="footer-section">
            <h4>서비스</h4>
            <ul>
              <li><a href="#">오디오북</a></li>
              <li><a href="#">전자책</a></li>
              <li><a href="#">플러스</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>회사 정보</h4>
            <ul>
              <li><a href="#">회사 소개</a></li>
              <li><a href="#">이용약관</a></li>
              <li><a href="#">개인정보처리방침</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>고객지원</h4>
            <ul>
              <li><a href="#">자주 묻는 질문</a></li>
              <li><a href="#">문의하기</a></li>
              <li><a href="#">공지사항</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-logo">
            <span className="logo-text">알라</span>
            <span className="logo-version">3.0</span>
          </div>
          <p className="copyright">© 2024 Alla 3.0. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 