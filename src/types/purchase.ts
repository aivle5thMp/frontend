export type PurchaseItemType = "point" | "subscription";

export interface PurchaseRequest {
  item: PurchaseItemType;
  amount: number;
  point: number; // 백엔드에서 필수 필드로 사용
}

export interface PurchaseResponse {
  status: string;
  createdAt: string;
}

export interface PointBalanceDTO {
  userId: string;
  lastPointChange: number;  // 마지막 포인트 변동량
  totalPoint: number;       // 현재 총 포인트
  lastReason: string;       // 마지막 변동 사유
  updatedAt: string;
}

export interface PointHistoryDTO {
  id: number;
  userId: string;
  point: number;           // 포인트 변동량
  totalPoint: number;      // 해당 시점의 총 포인트
  reason: string;          // 변동 사유
  createdAt: string;
}

export interface PointsPackage {
  id: number;
  points: number;
  originalPrice: number;
  finalPrice: number;
  discount: number;
  badge: string;
  popular: boolean;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
} 