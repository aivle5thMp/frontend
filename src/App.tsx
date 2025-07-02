import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage/AuthPage';
import PlusPage from './pages/PlusPage/PlusPage';
import AuthorApplyPage from './pages/AuthorApplyPage/AuthorApplyPage';
import AuthorManagePage from './pages/AuthorManagePage/AuthorManagePage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <ScrollToTop />
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/plus" element={<PlusPage />} />
              <Route path="/author-apply" element={<AuthorApplyPage />} />
              <Route path="/admin/author-management" element={<AuthorManagePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
