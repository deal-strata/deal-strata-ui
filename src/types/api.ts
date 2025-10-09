// Essential type definitions for API responses

// Base API response structure - used across all API services
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Legacy alias for backwards compatibility
export type BaseApiResponse<T = any> = ApiResponse<T>;

// User types
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  token?: string;
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}