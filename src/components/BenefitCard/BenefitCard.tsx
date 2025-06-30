import React from 'react';
import './BenefitCard.css';

interface BenefitCardProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  badge?: string;
  ctaText: string;
  icon?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ 
  title, 
  subtitle, 
  description, 
  backgroundColor, 
  textColor,
  badge,
  ctaText,
  icon
}) => {
  return (
    <div 
      className="benefit-card" 
      style={{ 
        background: backgroundColor, 
        color: textColor 
      }}
    >
      {badge && (
        <div className="benefit-badge">
          {badge}
        </div>
      )}
      
      <div className="benefit-card-content">
        <div className="benefit-header">
          {icon && <span className="benefit-icon">{icon}</span>}
          <div>
            <h2 className="benefit-title">{title}</h2>
            <h3 className="benefit-subtitle">{subtitle}</h3>
          </div>
        </div>
        <p className="benefit-description">{description}</p>
        <button className="benefit-button">
          {ctaText}
          <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="benefit-decoration">
        <div className="deco-circle"></div>
        <div className="deco-circle"></div>
        <div className="deco-circle"></div>
      </div>
    </div>
  );
};

export default BenefitCard; 