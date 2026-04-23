export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface SearchFilters {
  brand?: string;
  model?: string;
  year?: number;
  variant?: string;
  fuelType?: string;
  countrySpec?: string;
  category?: string;
  tag?: string;
  status?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  hotLeads: number;
  totalProducts: number;
  totalCategories: number;
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  topBrands: { brand: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
}
