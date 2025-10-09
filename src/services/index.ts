// Centralized exports for all API services
export { apiService, ApiService } from './apiService';
export { authApi, AuthApi } from './authApi';
export { lapCalculationApi, LapCalculationApi } from './lapCalculationApi';
export { documentsApi, DocumentsApi } from './documentsApi';

// Re-export types from centralized types directory
export type { ApiResponse, AuthUser, LoadingState } from '../types/api';
export type { 
  User, 
  LoginRequest, 
  SignupRequest, 
  SignupData, 
  LoginResponse, 
  SignupResponse 
} from './authApi';
export type {
  CalculationRequest,
  CalculationResult
} from './lapCalculationApi';
export type {
  LPADocument,
  WaterfallStep,
  WaterfallMetrics,
  UploadLPAResponse,
  ValidationResult,
  DocumentStatus,
  WaterfallType,
} from '../types/documents';