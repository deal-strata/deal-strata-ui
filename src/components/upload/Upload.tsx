import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import { agreementsService } from '../../services/agreementsService';
import type {
  AgreementApiCreateAgreementRequest,
  AgreementApiGetAgreementByIdRequest,
  CreateAgreement202Response,
  Agreement,
} from 'deal-strata-client';

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate title if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    // Validate file before upload
    const validation = agreementsService.validateFile(selectedFile);
    if (!validation.isValid) {
      alert(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);

    try {
      // Create explicit request object with all parameters
      const createRequest: AgreementApiCreateAgreementRequest = {
        file: selectedFile,
        title: title || selectedFile.name,
        description: description || undefined,
        dealId: undefined, // You can add a dealId selector if needed
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalFileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
        },
      };

      // Use the deal-strata-client directly
      const uploadResponse = await agreementApi.createAgreement(createRequest);
      const uploadData: CreateAgreement202Response = uploadResponse.data;
      
      if (uploadData.id) {
        // Create explicit request object for getting agreement details
        const getRequest: AgreementApiGetAgreementByIdRequest = {
          id: uploadData.id,
        };

        // Get the full agreement details
        const agreementResponse = await agreementApi.getAgreementById(getRequest);
        const agreement: Agreement = agreementResponse.data;
        
        console.log('Agreement created:', agreement);
        
        // Navigate to agreement details page
        navigate(`/agreements/${uploadData.id}`);
      } else {
        throw new Error(uploadData.message || 'Upload failed - no agreement ID returned');
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle error with proper type checking
      let errorMessage = 'Error processing file. Please try again.';
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
      setUploading(false);
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
          <li className="breadcrumb-item active" aria-current="page">
            Upload Document
          </li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Upload LPA Document</h2>
      </div>
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border rounded bg-white shadow-sm"
      >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Agreement Title:
          </label>
          <input
            className="form-control"
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter agreement title (optional)"
            disabled={uploading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description (optional):
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description"
            disabled={uploading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            Choose a document (PDF, DOCX, JPG, PNG):
          </label>
          <input
            className="form-control"
            type="file"
            id="file"
            name="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
            disabled={uploading}
          />
          {selectedFile && (
            <div className="mt-2 text-muted">
              Selected: {selectedFile.name} ({agreementsService.formatFileSize(selectedFile.size)})
            </div>
          )}
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={uploading || !selectedFile}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Analyzing Document...
              </>
            ) : (
              'Analyze Document'
            )}
          </button>
          <Link to="/agreements" className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default Upload;