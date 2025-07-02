import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { manuscriptService } from '../../services/manuscriptService';
import type { Manuscript } from '../../types/manuscript';
import { ManuscriptStatus } from '../../types/manuscript';
import { useAuth } from '../../hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import './ManuscriptDetailPage.css';

export const ManuscriptDetailPage: React.FC = () => {
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId || !id) return;
    loadManuscript();
  }, [user?.userId, id]);

  const loadManuscript = async () => {
    try {
      setLoading(true);
      const data = await manuscriptService.getManuscriptDetail(id!);
      
      if (!data) {
        setError('원고를 찾을 수 없습니다.');
        return;
      }
      
      // URL에서 받아온 ID를 manuscript 객체에 추가
      setManuscript({
        ...data,
        id: id! // URL 파라미터에서 받아온 ID 사용
      });
    } catch (err: any) {
      setError(err.message || '원고를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!manuscript) {
      console.error('No manuscript available for deletion');
      return;
    }
    
    try {
      setActionLoading('delete');
      console.log('Deleting manuscript with ID:', manuscript.id);
      await manuscriptService.deleteManuscript(manuscript.id);
      navigate('/manuscripts', { 
        state: { message: '원고가 삭제되었습니다.' }
      });
    } catch (err: any) {
      console.error('Error deleting manuscript:', err);
      setError(err.message || '원고 삭제에 실패했습니다.');
    } finally {
      setActionLoading(null);
      setShowDeleteConfirm(false);
    }
  };

  const handlePublish = async () => {
    if (!manuscript) {
      console.error('No manuscript available for publishing');
      return;
    }
    
    try {
      setActionLoading('publish');
      console.log('Publishing manuscript with ID:', manuscript.id);
      await manuscriptService.publishManuscript(manuscript.id);
      
      // 상태 업데이트
      setManuscript({
        ...manuscript,
        status: ManuscriptStatus.SUBMITTED
      });
      
      setShowPublishConfirm(false);
    } catch (err: any) {
      console.error('Error publishing manuscript:', err);
      setError(err.message || '출간 신청에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };



  const canEdit = manuscript?.status === ManuscriptStatus.DRAFT;
  const canDelete = manuscript?.status === ManuscriptStatus.DRAFT || manuscript?.status === ManuscriptStatus.REJECTED;
  const canPublish = manuscript?.status === ManuscriptStatus.DRAFT || manuscript?.status === ManuscriptStatus.REJECTED;

  if (!user) {
    return <div className="auth-required">로그인이 필요합니다.</div>;
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/manuscripts" className="btn btn-primary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="not-found">
        <h2>원고를 찾을 수 없습니다</h2>
        <Link to="/manuscripts" className="btn btn-primary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="manuscript-detail-page">
      <div className="container">
        <div className="page-header">
          <div className="header-top-row">
            <Link to="/manuscripts" className="btn btn-outline">
              ← 목록으로
            </Link>
            <div className="header-actions">
              {canEdit && (
                <Link 
                  to={`/manuscripts/${manuscript.id}/edit`}
                  className="btn btn-outline"
                >
                  수정
                </Link>
              )}
              
              {canPublish && (
                <button 
                  onClick={() => setShowPublishConfirm(true)}
                  className="btn btn-primary"
                  disabled={!!actionLoading}
                >
                  출간 신청
                </button>
              )}
              
              {canDelete && (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-danger"
                  disabled={!!actionLoading}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <div className="title-section">
            <h1>{manuscript.title}</h1>
          </div>
        </div>

        <div className="manuscript-meta">
          {manuscript.createdAt && (
            <span>작성일: {new Date(manuscript.createdAt).toLocaleDateString()}</span>
          )}
          {manuscript.updatedAt && (
            <span>수정일: {new Date(manuscript.updatedAt).toLocaleDateString()}</span>
          )}
          <span>글자 수: {manuscript.content.length}자</span>
        </div>

        <div className="manuscript-content">
          <div className="content-text">
            <ReactMarkdown>{manuscript.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 출간 신청 확인 모달 */}
      {showPublishConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>출간 신청 확인</h3>
            <p>이 원고를 출간 신청하시겠습니까?</p>
            <p className="warning">
              출간 신청 후에는 내용을 수정할 수 없습니다.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowPublishConfirm(false)}
                className="btn btn-outline"
                disabled={!!actionLoading}
              >
                취소
              </button>
              <button 
                onClick={handlePublish}
                className="btn btn-primary"
                disabled={!!actionLoading}
              >
                {actionLoading === 'publish' ? '신청 중...' : '출간 신청'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>원고 삭제 확인</h3>
            <p>정말로 이 원고를 삭제하시겠습니까?</p>
            <p className="warning">
              삭제된 원고는 복구할 수 없습니다.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
                disabled={!!actionLoading}
              >
                취소
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={!!actionLoading}
              >
                {actionLoading === 'delete' ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManuscriptDetailPage; 