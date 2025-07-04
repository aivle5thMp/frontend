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
import MyBookPage from './pages/MyBookPage/MyBookPage';
import ManuscriptPage from './pages/ManuscriptPage/ManuscriptPage';
import CreateManuscriptPage from './pages/CreateManuscriptPage/CreateManuscriptPage';
import ManuscriptDetailPage from './pages/ManuscriptDetailPage/ManuscriptDetailPage';
import EditManuscriptPage from './pages/EditManuscriptPage/EditManuscriptPage';
import PointsPurchasePage from './pages/PointsPurchasePage/PointsPurchasePage';
import BookReaderPage from './pages/BookReaderPage/BookReaderPage';

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
              <Route path="/points" element={<PointsPurchasePage />} />
              <Route path="/author-apply" element={<AuthorApplyPage />} />
              <Route path="/admin/author-management" element={<AuthorManagePage />} />
              <Route path="/my-books" element={<MyBookPage />} />
              <Route path="/read/:bookId" element={<BookReaderPage />} />
              
              {/* 원고 관리 라우트들 */}
              <Route path="/manuscripts" element={<ManuscriptPage />} />
              <Route path="/manuscripts/create" element={<CreateManuscriptPage />} />
              <Route path="/manuscripts/:id/edit" element={<EditManuscriptPage />} />
              <Route path="/manuscripts/:id" element={<ManuscriptDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
