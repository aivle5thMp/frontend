import apiService from './api';
import type { User, LoginCredentials, RegisterCredentials, LoginResponse, AuthTokens } from '../types/auth';

class AuthService {
  private readonly USER_KEY = 'user';

  /**
   * 회원가입
   */
  async register(credentials: RegisterCredentials): Promise<boolean> {
    try {
      await apiService.post('/auth/register', credentials);
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || '회원가입에 실패했습니다.');
    }
  }

  /**
   * 로그인
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      this.setAuthData(response.user, response.auth);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || '로그인에 실패했습니다.';
      throw new Error(errorMessage);
    }
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    this.clearAuthData();
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await apiService.get<User>('/auth/me');
      this.setUser(response);
      return response;
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.clearAuthData();
      return null;
    }
  }

  // ========== 로컬 스토리지 관리 ==========

  /**
   * 인증 데이터 저장
   */
  private setAuthData(user: User, auth: AuthTokens): void {
    apiService.setTokens(auth.accessToken, ''); // refreshToken은 현재 AuthTokens에 없으므로 빈 문자열
    this.setUser(user);
  }

  /**
   * 사용자 정보 저장
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * 액세스 토큰 조회
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * 사용자 정보 조회
   */
  getUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * 인증 데이터 정리
   */
  clearAuthData(): void {
    apiService.clearTokens();
    localStorage.removeItem(this.USER_KEY);
  }
}

// 싱글톤 인스턴스 생성
export const authService = new AuthService();
export default authService; 