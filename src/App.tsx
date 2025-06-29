import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BenefitSlider from './components/BenefitSlider';
import BookSection from './components/BookSection';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <BenefitSlider />
        <BookSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
