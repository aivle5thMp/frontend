import React from 'react';
import BenefitSlider from '../../components/BenefitSlider/BenefitSlider';
import BookRecommend from '../../components/BookRecommend/BookRecommend';
import BookSection from '../../components/BookSection/BookSection';

const HomePage: React.FC = () => {
  return (
    <>
      <BenefitSlider />
      <BookRecommend />
      <BookSection />
    </>
  );
};

export default HomePage; 