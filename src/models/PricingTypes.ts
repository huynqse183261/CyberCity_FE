// Pricing-specific types (use unique names to avoid collisions with other models)
export interface PricingPlanDTO {
  uid: string;
  planName: string;
  price: number;
  durationDays: number;
  features: string; // backend may return JSON string or plain text
  orderCount?: number;
}

export interface PricingListDTO {
  items: PricingPlanDTO[];
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

// Keep ApiResponse local to pricing service if needed; project has other ApiResponse definitions elsewhere.
// Interface cho gói định giá
export interface PricingPlan {
  key: string;
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  status: 'active' | 'inactive' | 'draft';
  features: PricingFeature[];
  maxUsers?: number;
  maxStorage?: number; // in GB
  isPopular?: boolean;
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface cho tính năng của gói định giá
export interface PricingFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  limit?: number;
}

// Interface cho thống kê định giá
export interface PricingStats {
  totalPlans: number;
  activePlans: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  popularPlan: string;
}

// Interface cho form tạo/sửa gói định giá
export interface PricingFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  status: 'active' | 'inactive' | 'draft';
  maxUsers?: number;
  maxStorage?: number;
  isPopular?: boolean;
  isCustom?: boolean;
  features: PricingFeatureInput[];
}

// Interface cho input tính năng
export interface PricingFeatureInput {
  name: string;
  description?: string;
  included: boolean;
  limit?: number;
}

// Interface cho filter định giá
export interface PricingFilter {
  searchText: string;
  status: string;
  billingPeriod: string;
  priceRange?: [number, number];
}
