import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { manuscriptService } from '../../services/manuscriptService';
import type { Manuscript } from '../../types/manuscript';
import { ManuscriptStatus } from '../../types/manuscript';
import { useAuth } from '../../hooks/useAuth';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import './EditManuscriptPage.css';

export const EditManuscriptPage: React.FC = () => {
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId || !id) return;
    loadManuscript();
  }, [user?.userId, id]);

  useEffect(() => {
    if (manuscript) {
      const titleChanged = title !== manuscript.title;
      const contentChanged = content !== manuscript.content;
      setHasChanges(titleChanged || contentChanged);
    }
  }, [title, content, manuscript]);

  const loadManuscript = async () => {
    try {
      setLoading(true);
      const data = await manuscriptService.getManuscriptDetail(id!);
      
      if (!data) {
        setError('원고를 찾을 수 없습니다.');
        return;
      }
      
      // 초안이 아닌 경우 수정 불가
      if (data.status !== ManuscriptStatus.DRAFT) {
        setError('초안 상태의 원고만 수정할 수 있습니다.');
        return;
      }
      
      // URL에서 받아온 ID를 manuscript 객체에 추가
      const manuscriptWithId = {
        ...data,
        id: id! // URL 파라미터에서 받아온 ID 사용
      };
      
      setManuscript(manuscriptWithId);
      setTitle(data.title);
      setContent(data.content);
    } catch (err: any) {
      setError(err.message || '원고를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manuscript || !user?.userId) {
      setError('수정할 수 없습니다.');
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
      setSaving(true);
      setError(null);
      
      const updatedManuscript: Manuscript = {
        ...manuscript,
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString()
      };

      await manuscriptService.editManuscript(updatedManuscript);
      
      // 성공 시 상세 페이지로 이동
      navigate(`/manuscripts/${manuscript.id}`, {
        state: { message: '원고가 수정되었습니다.' }
      });
    } catch (err: any) {
      setError(err.message || '원고 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        '변경사항이 저장되지 않습니다. 정말로 나가시겠습니까?'
      );
      if (!confirmed) return;
    }
    
    if (manuscript) {
      navigate(`/manuscripts/${manuscript.id}`);
    } else {
      navigate('/manuscripts');
    }
  };

  // 페이지 이탈 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

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
        <button onClick={() => navigate('/manuscripts')} className="btn btn-primary">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="not-found">
        <h2>원고를 찾을 수 없습니다</h2>
        <button onClick={() => navigate('/manuscripts')} className="btn btn-primary">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="edit-manuscript-page">
      <div className="container">
        <div className="page-header">
          <div className="header-info">
            <h1>원고 수정</h1>
            <span className="manuscript-info">
              {manuscript.title} | 초안
            </span>
          </div>
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
              disabled={saving}
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
              height={500}
              placeholder="원고 내용을 마크다운으로 수정하세요..."
              disabled={saving}
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
              disabled={saving}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving || !title.trim() || !content.trim() || !hasChanges}
            >
              {saving ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>

        {hasChanges && (
          <div className="changes-indicator">
            <div className="indicator-dot"></div>
            변경사항이 있습니다
          </div>
        )}

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

export default EditManuscriptPage; 