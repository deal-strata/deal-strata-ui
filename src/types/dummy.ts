// Dummy/Mock data for API responses
// This file contains all mock data used in API services for development and testing

import type { LPADocument, UploadLPAResponse } from './documents';

// Mock LPA Documents Collection
export const MOCK_LPA_DOCUMENTS: LPADocument[] = [
  {
    id: 'lpa_1697123456789_abc123',
    filename: 'Technology_Fund_LP_Agreement.pdf',
    uploadedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    status: 'completed',
    userId: 'user123',
    WaterfallSummary: 'Technology-focused venture fund with standard waterfall distribution including return of capital, 8% preferred return, GP catch-up, and 20% carried interest.',
    WaterfallMetrics: {
      "Total Distribution": 150000000,
      "Number of Steps": 4,
      "Distribution Type": "European Waterfall",
      "Management Fee": 2.0,
      "Carried Interest": 20.0,
    },
    WaterfallSteps: [
      {
        StepNumber: 1,
        Description: "Return of Capital",
        Threshold: 0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 75000000,
      },
      {
        StepNumber: 2,
        Description: "Preferred Return (8% IRR)",
        Threshold: 8.0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 30000000,
      },
      {
        StepNumber: 3,
        Description: "GP Catch-up to 20%",
        Threshold: "Until GP reaches 20%",
        Split: { LPs: 0.0, GP: 100.0 },
        "Amount Distributed": 22500000,
      },
      {
        StepNumber: 4,
        Description: "Carried Interest Split",
        Threshold: "Thereafter",
        Split: { LPs: 80.0, GP: 20.0 },
        "Amount Distributed": 22500000,
      },
    ],
    processedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'lpa_1697023456789_def456',
    filename: 'Real_Estate_Fund_Agreement.pdf',
    uploadedAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    status: 'completed',
    userId: 'user123',
    WaterfallSummary: 'Real estate investment fund with American waterfall structure, including deal-by-deal distributions and 15% carried interest after 7% hurdle rate.',
    WaterfallMetrics: {
      "Total Distribution": 85000000,
      "Number of Steps": 3,
      "Distribution Type": "American Waterfall",
      "Management Fee": 1.5,
      "Carried Interest": 15.0,
    },
    WaterfallSteps: [
      {
        StepNumber: 1,
        Description: "Return of Capital + 7% Hurdle",
        Threshold: 7.0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 60000000,
      },
      {
        StepNumber: 2,
        Description: "GP Catch-up",
        Threshold: "Until GP reaches 15%",
        Split: { LPs: 0.0, GP: 100.0 },
        "Amount Distributed": 10588235,
      },
      {
        StepNumber: 3,
        Description: "Carried Interest Split",
        Threshold: "Thereafter",
        Split: { LPs: 85.0, GP: 15.0 },
        "Amount Distributed": 14411765,
      },
    ],
    processedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'lpa_1696923456789_ghi789',
    filename: 'Healthcare_Partners_LPA.pdf',
    uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    status: 'completed',
    userId: 'user123',
    WaterfallSummary: 'Healthcare-focused private equity fund with tiered carried interest structure based on performance multiples.',
    WaterfallMetrics: {
      "Total Distribution": 200000000,
      "Number of Steps": 5,
      "Distribution Type": "Tiered European Waterfall",
      "Management Fee": 2.5,
      "Carried Interest": 25.0,
    },
    WaterfallSteps: [
      {
        StepNumber: 1,
        Description: "Return of Capital",
        Threshold: 0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 100000000,
      },
      {
        StepNumber: 2,
        Description: "Preferred Return (10% IRR)",
        Threshold: 10.0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 40000000,
      },
      {
        StepNumber: 3,
        Description: "GP Catch-up to 20%",
        Threshold: "Until GP reaches 20%",
        Split: { LPs: 0.0, GP: 100.0 },
        "Amount Distributed": 25000000,
      },
      {
        StepNumber: 4,
        Description: "20% Carry (up to 2.5x)",
        Threshold: "Up to 2.5x multiple",
        Split: { LPs: 80.0, GP: 20.0 },
        "Amount Distributed": 20000000,
      },
      {
        StepNumber: 5,
        Description: "25% Carry (above 2.5x)",
        Threshold: "Above 2.5x multiple",
        Split: { LPs: 75.0, GP: 25.0 },
        "Amount Distributed": 15000000,
      },
    ],
    processedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'lpa_1696823456789_jkl012',
    filename: 'Growth_Equity_Fund_IV.pdf',
    uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    status: 'processing',
    userId: 'user123',
    WaterfallSummary: 'Processing...',
    processedAt: undefined,
  },
  {
    id: 'lpa_1696723456789_mno345',
    filename: 'Infrastructure_Partners_2024.pdf',
    uploadedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    status: 'completed',
    userId: 'user123',
    WaterfallSummary: 'Infrastructure fund with long-term hold period and quarterly distribution provisions.',
    WaterfallMetrics: {
      "Total Distribution": 120000000,
      "Number of Steps": 3,
      "Distribution Type": "European Waterfall",
      "Management Fee": 1.75,
      "Carried Interest": 18.0,
    },
    WaterfallSteps: [
      {
        StepNumber: 1,
        Description: "Return of Capital + 6% Preferred",
        Threshold: 6.0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 85000000,
      },
      {
        StepNumber: 2,
        Description: "GP Catch-up to 18%",
        Threshold: "Until GP reaches 18%",
        Split: { LPs: 0.0, GP: 100.0 },
        "Amount Distributed": 18658537,
      },
      {
        StepNumber: 3,
        Description: "Carried Interest Split",
        Threshold: "Thereafter",
        Split: { LPs: 82.0, GP: 18.0 },
        "Amount Distributed": 16341463,
      },
    ],
    processedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

// Generate a mock upload response
export function generateMockUploadResponse(filename: string): UploadLPAResponse {
  return {
    documentId: `lpa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'processing',
    message: `Document "${filename}" uploaded successfully and processing started`,
  };
}

// Generate a mock document by ID
export function generateMockDocumentById(documentId: string): LPADocument {
  const isRecent = documentId.includes(Date.now().toString().substring(0, 8));

  return {
    id: documentId,
    filename: isRecent ? 'recently_uploaded_document.pdf' : 'sample_lpa_document.pdf',
    uploadedAt: isRecent
      ? new Date().toISOString()
      : new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'completed',
    userId: 'user123',
    WaterfallSummary:
      'This Limited Partnership Agreement contains waterfall distribution information with multiple allocation tiers including return of capital, preferred return, catch-up provisions, and carried interest splits.',
    WaterfallMetrics: {
      "Total Distribution": 100000000,
      "Number of Steps": 4,
      "Distribution Type": "European Waterfall",
      "Management Fee": 2.5,
      "Carried Interest": 20.0,
    },
    WaterfallSteps: [
      {
        StepNumber: 1,
        Description: "Return of Capital",
        Threshold: 0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 50000000,
      },
      {
        StepNumber: 2,
        Description: "Preferred Return (8% IRR)",
        Threshold: 8.0,
        Split: { LPs: 100.0, GP: 0.0 },
        "Amount Distributed": 20000000,
      },
      {
        StepNumber: 3,
        Description: "Catch-up to GP",
        Threshold: "Until GP reaches 20%",
        Split: { LPs: 0.0, GP: 100.0 },
        "Amount Distributed": 15000000,
      },
      {
        StepNumber: 4,
        Description: "Carried Interest Split",
        Threshold: "Thereafter",
        Split: { LPs: 80.0, GP: 20.0 },
        "Amount Distributed": 15000000,
      },
    ],
    processedAt: new Date().toISOString(),
  };
}

// File validation constants
export const FILE_VALIDATION = {
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_MB: 10,
} as const;

// Mock API delays (in milliseconds)
export const MOCK_DELAYS = {
  UPLOAD: 2000,
  GET_DOCUMENT: 1000,
  GET_ALL_DOCUMENTS: 800,
} as const;
