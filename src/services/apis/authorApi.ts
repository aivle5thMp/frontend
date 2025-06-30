import { BaseApiService } from './baseApi';

class AuthorApiService extends BaseApiService {
  constructor() {
    super(process.env.REACT_APP_AUTHOR_API_URL || 'http://localhost:8081/api');
  }
}

// Author API 인스턴스
export const authorApiService = new AuthorApiService(); 