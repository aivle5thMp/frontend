import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterCredentials } from '../../types/auth';
import './AuthForm.css';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterCredentials & { confirmPassword: string }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<typeof formData>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: Partial<typeof formData> = {};

    if (!formData.name) {
      errors.name = '이름을 입력하세요.';
    } else if (formData.name.length < 2) {
      errors.name = '이름은 2자 이상이어야 합니다.';
    }

    if (!formData.email) {
      errors.email = '이메일을 입력하세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      errors.password = '비밀번호를 입력하세요.';
    } else if (formData.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = '비밀번호 확인을 입력하세요.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      setShowSuccess(true);
      
      // 3초 후 성공 콜백 실행 (로그인 폼으로 전환)
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      // 에러는 useAuth에서 관리됨
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력 시 해당 필드의 에러 제거
    if (validationErrors[name as keyof typeof formData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (showSuccess) {
    return (
      <div className="auth-form">
        <div className="auth-success">
          <div className="success-icon">✅</div>
          <h2>회원가입 완료!</h2>
          <p>계정이 성공적으로 생성되었습니다.</p>
          <p>잠시 후 로그인 페이지로 이동합니다...</p>
          <button 
            className="auth-submit-btn"
            onClick={onSuccess}
          >
            지금 로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>회원가입</h2>
        <p>오디오북과 함께 새로운 독서 경험을 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-body">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={validationErrors.name ? 'error' : ''}
            placeholder="홍길동"
            autoComplete="name"
          />
          {validationErrors.name && (
            <span className="field-error">{validationErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={validationErrors.email ? 'error' : ''}
            placeholder="example@email.com"
            autoComplete="email"
          />
          {validationErrors.email && (
            <span className="field-error">{validationErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={validationErrors.password ? 'error' : ''}
            placeholder="8자 이상, 영문과 숫자 포함"
            autoComplete="new-password"
          />
          {validationErrors.password && (
            <span className="field-error">{validationErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={validationErrors.confirmPassword ? 'error' : ''}
            placeholder="비밀번호를 다시 입력하세요"
            autoComplete="new-password"
          />
          {validationErrors.confirmPassword && (
            <span className="field-error">{validationErrors.confirmPassword}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>

        <div className="auth-links">
          <button 
            type="button" 
            className="link-btn"
            onClick={onSwitchToLogin}
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 