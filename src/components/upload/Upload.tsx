import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { documentsApi } from '../../services';

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      // Use the API service for validation
      const validation = documentsApi.validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        event.target.value = '';
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);

    try {
      // Use the Documents API service for upload
      const uploadResult = await documentsApi.uploadLPA(selectedFile);
      
      if (uploadResult.success && uploadResult.data) {
        // Get the processing results using the document ID
        const resultsResponse = await documentsApi.getLPA(uploadResult.data.documentId);
        
        if (resultsResponse.success && resultsResponse.data) {
          // Navigate to agreement details page
          navigate(`/agreements/${uploadResult.data.documentId}`);
        } else {
          throw new Error(resultsResponse.error || 'Failed to get processing results');
        }
      } else {
        throw new Error(uploadResult.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing file. Please try again.');
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
          <label htmlFor="file" className="form-label">
            Choose a document (PDF, JPG, PNG):
          </label>
          <input
            className="form-control"
            type="file"
            id="file"
            name="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
            disabled={uploading}
          />
          {selectedFile && (
            <div className="mt-2 text-muted">
              Selected: {selectedFile.name} ({documentsApi.formatFileSize(selectedFile.size)})
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