import { authApiService } from './apis/authApi';
import type { User, LoginCredentials, RegisterCredentials, LoginResponse, AuthTokens } from '../types/auth';

class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user_info';

  /**
   * 회원가입
   * HTTP 상태코드로 성공여부 판단
   */
  async register(credentials: RegisterCredentials): Promise<boolean> {
    try {
      await authApiService.post('/auth/register', credentials);
      return true;
    } catch (error: any) {
      // HTTP 상태코드가 200번대가 아니면 실패
      console.error('Registration failed:', error);
      throw new Error(error.message || '회원가입에 실패했습니다.');
    }
  }

  /**
   * 로그인
   * 성공 시 사용자 정보와 토큰 반환
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await authApiService.post<LoginResponse>('/auth/login', credentials);
      this.setAuthData(response.user, response.auth);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '로그인에 실패했습니다.';
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
   * 토큰 갱신 (필요한 경우) - 현재 사용하지 않음
   */
  // async refreshToken(): Promise<string> {
  //   try {
  //     const response = await apiService.post<AuthTokens>('/auth/refresh');
  //     const { access_token } = response.data;
  //     
  //     // 새 토큰 저장
  //     this.setAccessToken(access_token);
  //     return access_token;
  //   } catch (error) {
  //     // 갱신 실패 시 로그아웃 처리
  //     this.clearAuthData();
  //     throw error;
  //   }
  // }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await authApiService.get<User>('/auth/me');
      
      // 사용자 정보 업데이트
      this.setUser(response);
      return response;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // 토큰이 유효하지 않으면 정리
      this.clearAuthData();
      return null;
    }
  }

  /**
   * 비밀번호 변경
   */
//   async changePassword(currentPassword: string, newPassword: string): Promise<void> {
//     try {
//       await apiService.patch('/auth/password', {
//         current_password: currentPassword,
//         new_password: newPassword,
//       });
//     } catch (error: any) {
//       throw new Error(error.message || '비밀번호 변경에 실패했습니다.');
//     }
//   }

  /**
   * 프로필 업데이트
   */
//   async updateProfile(updates: Partial<Pick<User, 'name' | 'email'>>): Promise<User> {
//     try {
//       const response = await apiService.patch<User>('/auth/profile', updates);
//       const updatedUser = response.data;
      
//       // 로컬 사용자 정보 업데이트
//       this.setUser(updatedUser);
//       return updatedUser;
//     } catch (error: any) {
//       throw new Error(error.message || '프로필 업데이트에 실패했습니다.');
//     }
//   }

  /**
   * 비밀번호 재설정 요청
   */
//   async requestPasswordReset(email: string): Promise<void> {
//     try {
//       await apiService.post('/auth/forgot-password', { email });
//     } catch (error: any) {
//       throw new Error(error.message || '비밀번호 재설정 요청에 실패했습니다.');
//     }
//   }

  /**
   * 비밀번호 재설정
   */
//   async resetPassword(token: string, newPassword: string): Promise<void> {
//     try {
//       await apiService.post('/auth/reset-password', {
//         token,
//         new_password: newPassword,
//       });
//     } catch (error: any) {
//       throw new Error(error.message || '비밀번호 재설정에 실패했습니다.');
//     }
//   }

  // ========== 로컬 스토리지 관리 ==========

  /**
   * 인증 데이터 저장
   */
  private setAuthData(user: User, auth: AuthTokens): void {
    this.setAccessToken(auth.accessToken);
    this.setUser(user);
    
    // 토큰 만료 시간 저장 (현재 시간 + expiresIn)
    const expiryTime = Date.now() + (auth.expiresIn * 1000);
    localStorage.setItem('token_expiry', expiryTime.toString());
  }

  /**
   * 액세스 토큰 저장
   */
  private setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
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
    return localStorage.getItem(this.TOKEN_KEY);
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
    
    if (!token || !user) return false;
    
    // 토큰 만료 확인
    const expiryTime = localStorage.getItem('token_expiry');
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      this.clearAuthData();
      return false;
    }
    
    return true;
  }

  /**
   * 토큰 만료 확인
   */
  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem('token_expiry');
    if (!expiryTime) return true;
    
    return Date.now() > parseInt(expiryTime);
  }

  /**
   * 인증 데이터 정리
   */
  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token_expiry');
  }

  /**
   * 토큰을 API 서비스에 설정
   */
  setupApiToken(): void {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired()) {
      // AuthApiService의 setTokens 메서드 사용
      authApiService.setTokens(token, ''); // refresh token은 사용하지 않으므로 빈 문자열
    }
  }
}

// 싱글톤 인스턴스 생성
export const authService = new AuthService();
export default authService; 