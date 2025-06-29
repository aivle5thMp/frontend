import React from 'react';
import '../styles/BenefitCard.css';

interface BenefitCardProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  textColor?: string;
  image?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ 
  title, 
  subtitle, 
  description, 
  backgroundColor, 
  textColor = 'white',
  image 
}) => {
  return (
    <div 
      className="benefit-card" 
      style={{ 
        backgroundColor, 
        color: textColor 
      }}
    >
      <div className="benefit-card-content">
        <h2 className="benefit-title">{title}</h2>
        <h3 className="benefit-subtitle">{subtitle}</h3>
        <p className="benefit-description">{description}</p>
      </div>
      {image && (
        <div className="benefit-card-image">
          <img src={image} alt={title} />
        </div>
      )}
    </div>
  );
};

export default BenefitCard; 