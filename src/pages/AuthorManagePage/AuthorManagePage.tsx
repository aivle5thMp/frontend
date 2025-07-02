import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authorService, type AuthorApplication } from '../../services/authorService';
import './AuthorManagePage.css';

const AuthorManagePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<AuthorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authorService.getAllApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // 관리자가 아니면 리다이렉트
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleApprove = async (applicationId: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(applicationId));
      await authorService.updateApplicationStatus(applicationId, true);
      
      // 승인 후 리스트 업데이트
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'APPROVED' as const }
            : app
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(applicationId));
      await authorService.updateApplicationStatus(applicationId, false);
      
      // 거부 후 리스트 업데이트
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'REJECTED' as const }
            : app
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-badge pending">대기중</span>;
      case 'APPROVED':
        return <span className="status-badge approved">승인</span>;
      case 'REJECTED':
        return <span className="status-badge rejected">거부</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };



  if (isLoading) {
    return (
      <div className="author-manage-page">
        <div className="loading">
          <div className="loading-icon">⏳</div>
          <p>작가 신청 리스트를 로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="author-manage-page">
      <div className="page-header">
        <h1>작가 신청 관리</h1>
        <div className="refresh-section">
          <button onClick={loadApplications} className="refresh-button">
            새로고침
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="applications-container">
        {applications.length === 0 ? (
          <div className="empty-state">
            <p>작가 신청이 없습니다.</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="applicant-info">
                    <h3>{application.name}</h3>
                    <p className="user-id">사용자 ID: {application.userId}</p>
                  </div>
                  <div className="status-section">
                    {getStatusBadge(application.status)}
                  </div>
                </div>

                <div className="application-content">
                  <div className="bio-section">
                    <label>작가 소개:</label>
                    <p>{application.bio}</p>
                  </div>
                  
                  <div className="portfolio-section">
                    <label>포트폴리오:</label>
                    <a 
                      href={application.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="portfolio-link"
                    >
                      {application.portfolioUrl}
                    </a>
                  </div>
                </div>

                <div className="application-footer">
                  {application.status === 'PENDING' && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleApprove(application.id)}
                        disabled={processingIds.has(application.id)}
                        className="approve-button"
                      >
                        {processingIds.has(application.id) ? '처리중...' : '승인'}
                      </button>
                      <button
                        onClick={() => handleReject(application.id)}
                        disabled={processingIds.has(application.id)}
                        className="reject-button"
                      >
                        {processingIds.has(application.id) ? '처리중...' : '거부'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorManagePage; 