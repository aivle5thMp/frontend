// 인증 관련 타입 정의
export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  isSubscribed: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
}

export interface LoginResponse {
  user: User;
  auth: AuthTokens;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code?: number;
}

export interface ApiError {
  message: string;
  code: number;
  details?: any;
} 