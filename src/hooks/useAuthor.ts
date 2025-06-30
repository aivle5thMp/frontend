import { useState, useEffect, useCallback } from 'react';
import { authorService, type AuthorApplicationData, type ApplicationResponse } from '../services/authorService';

interface UseAuthorReturn {
  // 상태
  applicationStatus: ApplicationResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // 액션
  applyForAuthor: (data: AuthorApplicationData) => Promise<boolean>;
  checkApplicationStatus: () => Promise<void>;
  clearError: () => void;
  resetApplication: () => void;
}

export const useAuthor = (): UseAuthorReturn => {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 신청 상태 초기화
  const resetApplication = useCallback(() => {
    setApplicationStatus(null);
    setError(null);
  }, []);

  // 작가 신청 상태 확인
  const checkApplicationStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authorService.checkApplicationStatus();
      setApplicationStatus(response);
    } catch (err) {
      // 404인 경우 신청 내역이 없는 것으로 처리
      if (err instanceof Error && err.message.includes('404')) {
        setApplicationStatus(null);
      } else {
        console.log('No existing application or error:', err);
        setApplicationStatus(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 작가 신청
  const applyForAuthor = useCallback(async (data: AuthorApplicationData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authorService.applyForAuthor(data);
      setApplicationStatus(response);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '작가 신청 중 오류가 발생했습니다.';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);


  // 컴포넌트 마운트 시 상태 확인
  useEffect(() => {
    checkApplicationStatus();
  }, [checkApplicationStatus]);

  return {
    // 상태
    applicationStatus,
    isLoading,
    isSubmitting,
    error,
    
    // 액션
    applyForAuthor,
    checkApplicationStatus,
    clearError,
    resetApplication,
  };
}; 