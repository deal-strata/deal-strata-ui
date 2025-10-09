// Documents API - Handles LPA document operations
// This file contains all document upload, retrieval, and management API calls

import type {
  ApiResponse,
  LPADocument,
  UploadLPAResponse,
  ValidationResult,
} from '../types';
import {
  MOCK_LPA_DOCUMENTS,
  FILE_VALIDATION,
  MOCK_DELAYS,
  generateMockUploadResponse,
  generateMockDocumentById,
} from '../types';

// Documents API class
export class DocumentsApi {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    console.log(`DocumentsApi initialized with baseURL: ${this.baseURL}`);
  }

  /**
   * POST /documents/upload
   * Upload an LPA document for processing
   */
  async uploadLPA(file: File): Promise<ApiResponse<UploadLPAResponse>> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch(`${this.baseURL}/documents/upload`, {
      //   method: 'POST',
      //   headers: this.getAuthHeaders(),
      //   body: formData,
      // });
      // const data = await response.json();
      // return { success: response.ok, data };

      // Mock implementation with delay
      await this.delay(MOCK_DELAYS.UPLOAD);

      const mockResponse = generateMockUploadResponse(file.name);

      return {
        success: true,
        data: mockResponse,
        message: 'Upload successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * GET /documents/:id
   * Get a specific LPA document by ID
   */
  async getLPA(documentId: string): Promise<ApiResponse<LPADocument>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/documents/${documentId}`, {
      //   method: 'GET',
      //   headers: this.getAuthHeaders(),
      // });
      // const data = await response.json();
      // return { success: response.ok, data };

      // Mock implementation with delay
      await this.delay(MOCK_DELAYS.GET_DOCUMENT);

      // Generate mock data based on document ID
      const mockDocument = generateMockDocumentById(documentId);

      return {
        success: true,
        data: mockDocument,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch document',
      };
    }
  }

  /**
   * GET /documents
   * Get all LPA documents for the current user
   */
  async getAllLPA(): Promise<ApiResponse<LPADocument[]>> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/documents`, {
      //   method: 'GET',
      //   headers: this.getAuthHeaders(),
      // });
      // const data = await response.json();
      // return { success: response.ok, data };

      // Mock implementation with delay
      await this.delay(MOCK_DELAYS.GET_ALL_DOCUMENTS);

      return {
        success: true,
        data: MOCK_LPA_DOCUMENTS,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch documents',
      };
    }
  }

  // Validation methods
  validateFile(file: File): ValidationResult {
    if (!FILE_VALIDATION.ALLOWED_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: 'Please select a valid file type (PDF, JPG, PNG)',
      };
    }

    if (file.size > FILE_VALIDATION.MAX_SIZE_BYTES) {
      return {
        isValid: false,
        error: `File size must be less than ${FILE_VALIDATION.MAX_SIZE_MB}MB`,
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File appears to be empty',
      };
    }

    return { isValid: true };
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSupportedFileTypes(): string[] {
    return [...FILE_VALIDATION.ALLOWED_TYPES];
  }

  getMaxFileSize(): number {
    return FILE_VALIDATION.MAX_SIZE_BYTES;
  }

  // Private helper methods
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Configuration methods
  setBaseURL(url: string): void {
    this.baseURL = url;
  }
}

// Export singleton instance
export const documentsApi = new DocumentsApi();