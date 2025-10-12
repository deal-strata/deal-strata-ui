import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import type {
  AgreementApiCreateCalculationRequest,
  CreateCalculation202Response,
} from 'deal-strata-client';

const CreateCalculation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const waterfallId = searchParams.get('waterfallId');
  const navigate = useNavigate();

  // Form state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string>('');
  const [dealCode, setDealCode] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const validateCsvFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return { isValid: false, error: 'File must be a CSV file' };
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    return { isValid: true };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!csvFile) {
      alert('Please select a CSV file to upload');
      return;
    }

    if (!effectiveDate || !dealCode) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate file before upload
    const validation = validateCsvFile(csvFile);
    if (!validation.isValid) {
      alert(validation.error || 'Invalid file');
      return;
    }

    setProcessing(true);

    try {
      // Create explicit request object with all parameters
      const createRequest: AgreementApiCreateCalculationRequest = {
        file: csvFile,
        title: `${dealCode} - Calculation (${effectiveDate})`,
        description: `Calculation for deal ${dealCode} with effective date ${effectiveDate}`,
        dealId: dealCode,
        metadata: {
          effectiveDate,
          dealCode,
          agreementId: id,
          waterfallId: waterfallId || undefined,
          uploadedAt: new Date().toISOString(),
          originalFileName: csvFile.name,
          fileSize: csvFile.size,
          mimeType: csvFile.type,
        },
      };

      // Use the deal-strata-client directly
      const response = await agreementApi.createCalculation(createRequest);
      const calculationData: CreateCalculation202Response = response.data;
      
      if (calculationData.id) {
        console.log('Calculation created:', calculationData);
        
        // Navigate to agreement details page (or calculation results if you have that route)
        alert('Calculation created successfully!');
        navigate(`/agreements/${id}`);
      } else {
        throw new Error(calculationData.message || 'Calculation creation failed - no ID returned');
      }
      
    } catch (error) {
      console.error('Calculation creation error:', error);
      
      // Handle error with proper type checking
      let errorMessage = 'Error creating calculation. Please try again.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
        };
        errorMessage = axiosError.response?.data?.message 
          || axiosError.response?.data?.error 
          || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/agreements">All Agreements</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/agreements/${id}`}>Agreement Details</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            New Calculation
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Calculation
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {waterfallId && (
              <div className="alert alert-info mb-4">
                <strong>Pre-selected Waterfall ID:</strong> <code>{waterfallId}</code>
              </div>
            )}

            {/* Deal Code */}
            <div className="mb-3">
              <label htmlFor="dealCode" className="form-label">
                Deal Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="dealCode"
                value={dealCode}
                onChange={(e) => setDealCode(e.target.value)}
                placeholder="Enter deal code"
                required
                disabled={processing}
              />
              <div className="form-text">
                Enter the unique identifier for this deal
              </div>
            </div>

            {/* Effective Date */}
            <div className="mb-3">
              <label htmlFor="effectiveDate" className="form-label">
                Effective Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="effectiveDate"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
                disabled={processing}
              />
              <div className="form-text">
                The date that the calculations must be considered for
              </div>
            </div>

            {/* CSV File Upload */}
            <div className="mb-4">
              <label htmlFor="csvFile" className="form-label">
                Transactions CSV File <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                required
                disabled={processing}
              />
              <div className="form-text">
                Upload a CSV file containing the list of transactions
              </div>
              {csvFile && (
                <div className="mt-2 text-muted">
                  Selected: {csvFile.name} ({formatFileSize(csvFile.size)})
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 justify-content-end">
              <Link 
                to={`/agreements/${id}`} 
                className="btn btn-outline-secondary"
                onClick={(e) => {
                  if (processing) {
                    e.preventDefault();
                  }
                }}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={processing || !csvFile || !effectiveDate || !dealCode}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing Calculation...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-1"></i>
                    Create Calculation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCalculation;
