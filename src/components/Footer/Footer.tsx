import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Chapt12</h3>
            <p className="footer-description">
              새로운 독서 경험을 제공하는 전자책 플랫폼
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">서비스</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">전자책</a></li>
              <li><a href="#" className="footer-link">플러스</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">팀</h4>
            <ul className="footer-links">
              <li><a href="/about" className="footer-link">소개</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 Chapt12. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 