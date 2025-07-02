// 원고 관련 타입 정의
export interface Manuscript {
  id: string;
  userId: string; // author_id
  title: string;
  content: string;
  status: ManuscriptStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum ManuscriptStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED'
}

// API 요청/응답 타입들
export interface CreateManuscriptRequest {
  author_id: string;
  title: string;
  content: string;
}

export interface ManuscriptDetailRequest {
  id: string;
  author_id: string;
}

export interface EditManuscriptRequest {
  id: string;
  author_id: string;
  title: string;
  content: string;
}

export interface DeleteManuscriptRequest {
  id: string;
  author_id: string;
}

export interface PublishManuscriptRequest {
  id: string;
  author_id: string;
}

export interface ManuscriptResponse {
  success: boolean;
  id?: string;
  title?: string;
  content?: string;
  status?: string;
  message?: string;
}

export interface ManuscriptListFilters {
  author_id: string;
  status?: ManuscriptStatus;
  search?: string;
} 