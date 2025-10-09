// Document-related type definitions

// Waterfall calculation structures
export interface WaterfallStep {
  StepNumber: number;
  Description: string;
  Threshold: string | number;
  Split: {
    LPs: number;
    GP: number;
  };
  "Amount Distributed": number;
}

export interface WaterfallMetrics {
  "Total Distribution": number;
  "Number of Steps": number;
  "Distribution Type": string;
  "Management Fee": number;
  "Carried Interest": number;
}

// LPA Document structure
export interface LPADocument {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  userId?: string;
  WaterfallSummary?: string;
  WaterfallMetrics?: WaterfallMetrics;
  WaterfallSteps?: WaterfallStep[];
  processedAt?: string;
}

// Upload response
export interface UploadLPAResponse {
  documentId: string;
  status: string;
  message: string;
}

// File validation result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Document status
export type DocumentStatus = 'processing' | 'completed' | 'failed';

// Waterfall types
export type WaterfallType = 'European Waterfall' | 'American Waterfall' | 'Tiered European Waterfall';
