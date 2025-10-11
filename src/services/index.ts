// Centralized exports for all API services
export { apiService, ApiService } from './apiService';
export { authApi, AuthApi } from './authApi';
export { lapCalculationApi, LapCalculationApi } from './lapCalculationApi';
export { documentsApi, DocumentsApi } from './DocumentsApi';
export { agreementsService, AgreementsService } from './agreementsService';
export { agreementApi, healthApi, updateAuthToken, getBasePath } from './clientConfig';

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

// Re-export types from agreementsService
export type {
  CreateAgreementParams,
  ListAgreementsParams,
  GetAgreementParams,
  UpdateAgreementParams,
  DeleteAgreementParams,
} from './agreementsService';

// Re-export types from deal-strata-client
export type {
  Agreement,
  AgreementList,
  AgreementStatus,
  AgreementApiCreateAgreementRequest,
  AgreementApiListAgreementsRequest,
  AgreementApiGetAgreementByIdRequest,
  AgreementApiUpdateAgreementRequest,
  AgreementApiDeleteAgreementRequest,
  CreateAgreement202Response,
} from 'deal-strata-client';