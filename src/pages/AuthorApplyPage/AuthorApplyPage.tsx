import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthor } from '../../hooks/useAuthor';
import type { AuthorApplicationData } from '../../services/authorService';
import './AuthorApplyPage.css';

const AuthorApplyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    applicationStatus,
    isLoading,
    isSubmitting,
    error,
    applyForAuthor,
    clearError,
    resetApplication
  } = useAuthor();

  const [formData, setFormData] = useState<AuthorApplicationData>({
    name: '',
    bio: '',
    portfolio_url: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 비로그인 또는 이미 작가인 경우 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== 'USER') {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await applyForAuthor(formData);
    if (success) {
      setSubmitSuccess(true);
    }
  };

  const handleReapply = () => {
    resetApplication();
    setSubmitSuccess(false);
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="author-apply-page">
        <div className="status-message">
          <div className="status-icon">⏳</div>
          <h2>로딩 중...</h2>
          <p>신청 상태를 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  // 이미 신청한 경우 상태 표시
  if (applicationStatus?.status === 'PENDING') {
    return (
      <div className="author-apply-page">
        <div className="status-message pending">
          <div className="status-icon">⏳</div>
          <h2>작가 신청이 검토 중입니다</h2>
          <p>관리자가 신청 내용을 검토하고 있습니다.</p>
          <p className="status-note">* 승인까지 최대 3일이 소요될 수 있습니다.</p>
        </div>
      </div>
    );
  }

  if (applicationStatus?.status === 'REJECTED') {
    return (
      <div className="author-apply-page">
        <div className="status-message rejected">
          <div className="status-icon">❌</div>
          <h2>작가 신청이 거절되었습니다</h2>
          <p>{applicationStatus.message || '신청 내용을 수정하여 다시 시도해주세요.'}</p>
          <button 
            className="reapply-button"
            onClick={handleReapply}
          >
            다시 신청하기
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="author-apply-page">
        <div className="success-message">
          <div className="success-icon">✨</div>
          <h2>작가 신청이 완료되었습니다!</h2>
          <p>관리자 검토 후 승인 여부를 알려드리겠습니다.</p>
          <p className="success-note">* 승인까지 최대 3일이 소요될 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="author-apply-page">
      <div className="form-container">
        <div className="form-header">
          <h1>작가 신청</h1>
          <p>당신의 이야기를 Chapt12에서 들려주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="author-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="실명을 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">작가 소개</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="작가님을 소개해주세요 (예: 제2의 해리포터를 만들고 싶은 창의적인 작가)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="portfolio_url">포트폴리오 URL</label>
            <input
              type="url"
              id="portfolio_url"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="작품을 확인할 수 있는 URL을 입력해주세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? '신청 중...' : '작가 신청하기'}
          </button>

          <p className="form-note">
            * 승인 시 작가 활동이 가능하며, 관리자 검토 후 결과를 알려드립니다.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthorApplyPage; 