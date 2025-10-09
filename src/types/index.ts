// Centralized type exports
// Import types from here for cleaner imports across the app

// API types
export type { ApiResponse, BaseApiResponse, AuthUser, LoadingState } from './api';

// Document types
export type {
  LPADocument,
  WaterfallStep,
  WaterfallMetrics,
  UploadLPAResponse,
  ValidationResult,
  DocumentStatus,
  WaterfallType,
} from './documents';

// Dummy data and constants
export {
  MOCK_LPA_DOCUMENTS,
  FILE_VALIDATION,
  MOCK_DELAYS,
  generateMockUploadResponse,
  generateMockDocumentById,
} from './dummy';
