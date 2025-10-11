/**
 * Agreements Service
 * Type-safe wrapper around the deal-strata-client AgreementApi
 * All request and response types are explicitly defined
 */

import { agreementApi } from './clientConfig';
import type {
  Agreement,
  AgreementList,
  AgreementStatus,
  CreateAgreement202Response,
  AgreementApiCreateAgreementRequest,
  AgreementApiListAgreementsRequest,
  AgreementApiGetAgreementByIdRequest,
  AgreementApiUpdateAgreementRequest,
  AgreementApiDeleteAgreementRequest,
  UpdateAgreementRequest,
} from 'deal-strata-client';

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Request type for creating a new agreement
 */
export interface CreateAgreementParams {
  file: File;
  title?: string;
  description?: string;
  dealId?: string;
  metadata?: { [key: string]: any };
}

/**
 * Request type for listing agreements
 */
export interface ListAgreementsParams {
  dealId?: string;
  status?: AgreementStatus;
  limit?: number;
  offset?: number;
}

/**
 * Request type for getting a single agreement
 */
export interface GetAgreementParams {
  id: string;
}

/**
 * Request type for updating agreement metadata
 */
export interface UpdateAgreementParams {
  id: string;
  title?: string;
  description?: string;
  status?: AgreementStatus;
  metadata?: { [key: string]: any };
}

/**
 * Request type for deleting an agreement
 */
export interface DeleteAgreementParams {
  id: string;
}

/**
 * Agreements Service Class
 * Provides type-safe methods for interacting with the Agreement API
 */
export class AgreementsService {
  
  /**
   * Upload a new agreement document
   */
  async createAgreement(params: CreateAgreementParams): Promise<ApiResponse<CreateAgreement202Response>> {
    try {
      const request: AgreementApiCreateAgreementRequest = {
        file: params.file,
        title: params.title,
        description: params.description,
        dealId: params.dealId,
        metadata: params.metadata,
      };

      const response = await agreementApi.createAgreement(request);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError<CreateAgreement202Response>(error, 'Failed to create agreement');
    }
  }

  /**
   * List all agreements with optional filters
   */
  async listAgreements(params: ListAgreementsParams = {}): Promise<ApiResponse<AgreementList>> {
    try {
      const request: AgreementApiListAgreementsRequest = {
        dealId: params.dealId,
        status: params.status,
        limit: params.limit ?? 50,
        offset: params.offset ?? 0,
      };

      const response = await agreementApi.listAgreements(request);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError<AgreementList>(error, 'Failed to list agreements');
    }
  }

  /**
   * Get a single agreement by ID
   */
  async getAgreementById(params: GetAgreementParams): Promise<ApiResponse<Agreement>> {
    try {
      const request: AgreementApiGetAgreementByIdRequest = {
        id: params.id,
      };

      const response = await agreementApi.getAgreementById(request);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError<Agreement>(error, 'Failed to get agreement');
    }
  }

  /**
   * Update agreement metadata
   */
  async updateAgreement(params: UpdateAgreementParams): Promise<ApiResponse<Agreement>> {
    try {
      const updateRequest: UpdateAgreementRequest = {
        title: params.title,
        description: params.description,
        status: params.status,
        metadata: params.metadata,
      };

      const request: AgreementApiUpdateAgreementRequest = {
        id: params.id,
        updateAgreementRequest: updateRequest,
      };

      const response = await agreementApi.updateAgreement(request);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError<Agreement>(error, 'Failed to update agreement');
    }
  }

  /**
   * Delete an agreement (soft delete)
   */
  async deleteAgreement(params: DeleteAgreementParams): Promise<ApiResponse<void>> {
    try {
      const request: AgreementApiDeleteAgreementRequest = {
        id: params.id,
      };

      await agreementApi.deleteAgreement(request);
      
      return {
        success: true,
      };
    } catch (error) {
      return this.handleError<void>(error, 'Failed to delete agreement');
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png',
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 50MB limit',
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload PDF, DOCX, or image files.',
      };
    }

    return { isValid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Handle API errors consistently
   */
  private handleError<T>(error: unknown, defaultMessage: string): ApiResponse<T> {
    console.error('API Error:', error);

    // Handle axios errors
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const message = axiosError.response?.data?.message 
        || axiosError.response?.data?.error 
        || axiosError.message 
        || defaultMessage;

      return {
        success: false,
        error: message,
      };
    }

    // Handle standard errors
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: defaultMessage,
    };
  }
}

// Export singleton instance
export const agreementsService = new AgreementsService();
