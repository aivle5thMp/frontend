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