import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { manuscriptService } from '../../services/manuscriptService';
import type { Manuscript } from '../../types/manuscript';
import { ManuscriptStatus } from '../../types/manuscript';
import { useAuth } from '../../hooks/useAuth';
import './ManuscriptPage.css';

export const ManuscriptPage: React.FC = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ManuscriptStatus | ''>('');
  const [searchPending, setSearchPending] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  const { user } = useAuth();

  // 검색어 debounce 처리
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // 검색어가 변경되었고 debouncedSearchTerm과 다르면 pending 상태로 설정
    if (searchTerm !== debouncedSearchTerm) {
      setSearchPending(true);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setSearchPending(false);
    }, 1500); // 1.5초 후 검색 실행

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, debouncedSearchTerm]);

  // 실제 검색 실행
  useEffect(() => {
    if (!user?.userId) return;
    loadManuscripts();
  }, [user?.userId, debouncedSearchTerm, statusFilter]);

  const loadManuscripts = async () => {
    try {
      setLoading(true);
      const filters = {
        author_id: user!.userId,
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm })
      };
      
      const data = await manuscriptService.getFilteredManuscripts(filters);
      setManuscripts(data);
    } catch (err: any) {
      setError(err.message || '원고 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };



  const getStatusColor = (status: ManuscriptStatus) => {
    switch (status) {
      case ManuscriptStatus.DRAFT:
        return 'status-draft';
      case ManuscriptStatus.SUBMITTED:
        return 'status-submitted';
      case ManuscriptStatus.PUBLISHED:
        return 'status-published';
      case ManuscriptStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  };

  const getStatusText = (status: ManuscriptStatus) => {
    switch (status) {
      case ManuscriptStatus.DRAFT:
        return '초안';
      case ManuscriptStatus.SUBMITTED:
        return '출간 신청됨';
      case ManuscriptStatus.PUBLISHED:
        return '출간됨';
      case ManuscriptStatus.REJECTED:
        return '반려됨';
      default:
        return status;
    }
  };

  if (!user) {
    return <div className="auth-required">로그인이 필요합니다.</div>;
  }

  return (
    <div className="manuscript-page">
      <div className="container">
        <div className="page-header">
          <h1>내 원고 관리</h1>
          <Link to="/manuscripts/create" className="btn btn-primary">
            새 원고 작성
          </Link>
        </div>

        <div className="filters">
          <div className="search-box">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="제목이나 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Enter 키를 누르면 즉시 검색
                    if (debounceTimeoutRef.current) {
                      clearTimeout(debounceTimeoutRef.current);
                    }
                    setDebouncedSearchTerm(searchTerm);
                    setSearchPending(false);
                  }
                }}
                className={`search-input ${searchPending ? 'search-pending' : ''}`}
              />
              {searchPending && (
                <div className="search-indicator">
                  <span className="search-dot"></span>
                  <span className="search-dot"></span>
                  <span className="search-dot"></span>
                </div>
              )}
            </div>
          </div>
          
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ManuscriptStatus | '')}
              className="filter-select"
            >
              <option value="">모든 상태</option>
              <option value={ManuscriptStatus.DRAFT}>초안</option>
              <option value={ManuscriptStatus.SUBMITTED}>출간 신청됨</option>
              <option value={ManuscriptStatus.PUBLISHED}>출간됨</option>
              <option value={ManuscriptStatus.REJECTED}>반려됨</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">로딩 중...</div>}
        
        {error && <div className="error-message">{error}</div>}

        {!loading && manuscripts.length === 0 && (
          <div className="empty-state">
            <h3>작성된 원고가 없습니다</h3>
            <p>첫 번째 원고를 작성해보세요!</p>
            <Link to="/manuscripts/create" className="btn btn-primary">
              원고 작성하기
            </Link>
          </div>
        )}

        {!loading && manuscripts.length > 0 && (
          <div className="manuscripts-grid">
            {manuscripts.map((manuscript) => (
              <div key={manuscript.id} className="manuscript-card">
                <div className="card-header">
                  <h3 className="manuscript-title">
                    <Link to={`/manuscripts/${manuscript.id}`}>
                      {manuscript.title}
                    </Link>
                  </h3>
                  <span className={`status-badge ${getStatusColor(manuscript.status)}`}>
                    {getStatusText(manuscript.status)}
                  </span>
                </div>
                
                <div className="manuscript-content">
                  {manuscript.content.length > 150 
                    ? `${manuscript.content.substring(0, 150)}...` 
                    : manuscript.content
                  }
                </div>
                
                <div className="card-footer">
                  <div className="card-actions">
                    {manuscript.status === ManuscriptStatus.DRAFT && (
                      <Link 
                        to={`/manuscripts/${manuscript.id}/edit`}
                        className="btn btn-outline btn-sm"
                      >
                        수정
                      </Link>
                    )}
                    
                    <Link 
                      to={`/manuscripts/${manuscript.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManuscriptPage;
