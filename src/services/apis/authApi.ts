import { BaseApiService } from './baseApi';

class AuthApiService extends BaseApiService {
  constructor() {
    super(process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8080/api');
  }
}

// Auth API 인스턴스
export const authApiService = new AuthApiService(); 