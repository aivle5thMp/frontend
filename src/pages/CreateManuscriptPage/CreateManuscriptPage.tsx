import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { manuscriptService } from '../../services/manuscriptService';
import type { Manuscript } from '../../types/manuscript';
import { ManuscriptStatus } from '../../types/manuscript';
import { useAuth } from '../../hooks/useAuth';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import './CreateManuscriptPage.css';

export const CreateManuscriptPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.userId) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newManuscript: Manuscript = {
        id: '', // 서버에서 생성됨
        userId: user.userId,
        title: title.trim(),
        content: content.trim(),
        status: ManuscriptStatus.DRAFT
      };

      const manuscriptId = await manuscriptService.createManuscript(newManuscript);
      
      // 성공 시 상세 페이지로 이동
      navigate(`/manuscripts/${manuscriptId}`);
    } catch (err: any) {
      setError(err.message || '원고 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/manuscripts');
  };

  if (!user) {
    return <div className="auth-required">로그인이 필요합니다.</div>;
  }

  return (
    <div className="create-manuscript-page">
      <div className="container">
        <div className="page-header">
          <h1>새 원고 작성</h1>
          <p className="subtitle">당신의 이야기를 세상과 나누세요</p>
        </div>

        <form onSubmit={handleSubmit} className="manuscript-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              제목 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="원고 제목을 입력하세요"
              className="form-input"
              disabled={loading}
              maxLength={200}
            />
            <div className="char-count">
              {title.length}/200
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              내용 <span className="required">*</span>
            </label>
            <MarkdownEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={600}
              placeholder="원고 내용을 마크다운으로 작성하세요..."
              disabled={loading}
            />
            <div className="char-count">
              {content.length} 자
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !title.trim() || !content.trim()}
            >
              {loading ? '저장 중...' : '원고 저장'}
            </button>
          </div>
        </form>

        <div className="writing-tips">
          <h3>✍️ 마크다운 작성 가이드</h3>
          <div className="markdown-guide">
            <div className="guide-column">
              <h4>기본 문법</h4>
              <ul>
                <li><code># 제목</code> - 제목 (1~6단계)</li>
                <li><code>**굵은 글씨**</code></li>
                <li><code>*기울임*</code></li>
                <li><code>`코드`</code></li>
              </ul>
            </div>
            <div className="guide-column">
              <h4>구조화</h4>
              <ul>
                <li><code>- 목록</code> - 불릿 목록</li>
                <li><code>1. 번호</code> - 번호 목록</li>
                <li><code>&gt; 인용</code> - 인용문</li>
                <li><code>---</code> - 구분선</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateManuscriptPage; 