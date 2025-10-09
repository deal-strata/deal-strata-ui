import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { documentsApi } from '../../services';
import type { LPADocument } from '../../types';

const AllAgreements: React.FC = () => {
  const [documents, setDocuments] = useState<LPADocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await documentsApi.getAllLPA();
      
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        setError(response.error || 'Failed to load documents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (documentId: string) => {
    // Navigate to agreement details page
    navigate(`/agreements/${documentId}`);
  };

  const getStatusBadgeClass = (status: LPADocument['status']): string => {
    switch (status) {
      case 'completed':
        return 'badge bg-success';
      case 'processing':
        return 'badge bg-warning text-dark';
      case 'failed':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading agreements...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Documents</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={loadDocuments}>
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All LPA Documents</h2>
        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
          <i className="bi bi-plus-circle me-2"></i>
          Upload New Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-file-earmark-text" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          </div>
          <h4 className="text-muted">No Documents Found</h4>
          <p className="text-muted">Upload your first LPA document to get started</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/upload')}>
            Upload Document
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 text-muted">
            Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
          </div>

          <div className="row g-4">
            {documents.map((doc) => (
              <div key={doc.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0" style={{ fontSize: '1rem' }}>
                        {doc.filename}
                      </h5>
                      <span className={getStatusBadgeClass(doc.status)}>
                        {doc.status}
                      </span>
                    </div>

                    <p className="text-muted small mb-3">
                      <i className="bi bi-calendar me-1"></i>
                      Uploaded: {formatDate(doc.uploadedAt)}
                    </p>

                    {doc.status === 'completed' && doc.WaterfallMetrics && (
                      <div className="mb-3">
                        <div className="row g-2">
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <small className="text-muted d-block">Total Distribution</small>
                              <strong className="small">
                                {formatCurrency(doc.WaterfallMetrics["Total Distribution"])}
                              </strong>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <small className="text-muted d-block">Waterfall Type</small>
                              <strong className="small" style={{ fontSize: '0.75rem' }}>
                                {doc.WaterfallMetrics["Distribution Type"]}
                              </strong>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <small className="text-muted d-block">Carried Interest</small>
                              <strong className="small">
                                {doc.WaterfallMetrics["Carried Interest"]}%
                              </strong>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 bg-light rounded">
                              <small className="text-muted d-block">Steps</small>
                              <strong className="small">
                                {doc.WaterfallMetrics["Number of Steps"]}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {doc.status === 'completed' && doc.WaterfallSummary && (
                      <p className="card-text small text-muted mb-3" style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {doc.WaterfallSummary}
                      </p>
                    )}

                    {doc.status === 'processing' && (
                      <div className="alert alert-warning py-2 small mb-3">
                        <i className="bi bi-hourglass-split me-2"></i>
                        Document is being processed...
                      </div>
                    )}

                    {doc.status === 'failed' && (
                      <div className="alert alert-danger py-2 small mb-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Processing failed
                      </div>
                    )}
                  </div>

                  <div className="card-footer bg-white border-top-0">
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleViewDocument(doc.id)}
                      disabled={doc.status !== 'completed'}
                    >
                      <i className="bi bi-eye me-1"></i>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </Layout>
  );
};

export default AllAgreements;
