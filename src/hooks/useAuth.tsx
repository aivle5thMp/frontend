import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authService } from '../services/authService';

// Auth Context 타입
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  // updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => Promise<void>;
  // changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// 초기 상태
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      const user = authService.getUser();
      const token = authService.getAccessToken();
      
      if (user && token && !authService.isTokenExpired()) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        authService.setupApiToken();
      } else {
        authService.clearAuthData();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // 로그인
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      authService.setupApiToken();
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  // 회원가입
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authService.register(credentials);
      // 회원가입 성공 후 자동 로그인은 하지 않음
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // 프로필 업데이트
//   const updateProfile = async (updates: Partial<Pick<User, 'name' | 'email'>>): Promise<void> => {
//     try {
//       const updatedUser = await authService.updateProfile(updates);
//       dispatch({ type: 'UPDATE_USER', payload: updatedUser });
//     } catch (error: any) {
//       dispatch({ type: 'AUTH_FAILURE', payload: error.message });
//       throw error;
//     }
//   };

  // 비밀번호 변경
//   const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
//     try {
//       await authService.changePassword(currentPassword, newPassword);
//     } catch (error: any) {
//       dispatch({ type: 'AUTH_FAILURE', payload: error.message });
//       throw error;
//     }
//   };

  // 에러 정리
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    // updateProfile,
    // changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth; 