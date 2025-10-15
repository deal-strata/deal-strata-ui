/**
 * Example: Using deal-strata-client in AllAgreements Component
 * 
 * This example demonstrates:
 * 1. Using explicit request objects
 * 2. Proper type safety with response data
 * 3. Filtering and pagination
 * 4. Error handling
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import type {
  AgreementApiListAgreementsRequest,
  AgreementList,
  Agreement,
  AgreementStatus,
} from 'deal-strata-client';

const AllAgreements: React.FC = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<AgreementStatus | ''>('');
  const pageSize = 20;
  
  const navigate = useNavigate();

  useEffect(() => {
    loadAgreements();
  }, [currentPage, statusFilter]);

  const loadAgreements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create explicit request object with all parameters
      const request: AgreementApiListAgreementsRequest = {
        status: statusFilter || undefined,
        limit: pageSize,
        offset: currentPage * pageSize,
      };

      // Call API with typed request
      const response = await agreementApi.listAgreements(request);
      
      // Type the response data explicitly
      const data: AgreementList = response.data;
      
      setAgreements(data.agreements);
      setTotal(data.total);
      
    } catch (err) {
      // Handle errors with proper type checking
      let errorMessage = 'Failed to load agreements';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
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
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAgreement = (agreementId: string) => {
    navigate(`/agreements/${agreementId}`);
  };

  const handleStatusFilterChange = (status: AgreementStatus | '') => {
    setStatusFilter(status);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const getStatusBadgeClass = (status?: AgreementStatus): string => {
    switch (status) {
      case 'Completed':
        return 'badge bg-success';
      case 'Processing':
        return 'badge bg-warning text-dark';
      case 'InWaterfall':
        return 'badge bg-info';
      case 'Started':
        return 'badge bg-primary';
      case 'Uploaded':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const totalPages = Math.ceil(total / pageSize);

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
          <h4 className="alert-heading">Error Loading Agreements</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={loadAgreements}>
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">All Agreements-test</h2>
          <p className="text-muted mb-0">
            Showing {agreements.length} of {total} agreements
          </p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          + Upload New Agreement
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Filter by Status:</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value as AgreementStatus | '')}
              >
                <option value="">All Statuses</option>
                <option value="Uploaded">Uploaded</option>
                <option value="Processing">Processing</option>
                <option value="NotStarted">Not Started</option>
                <option value="Started">Started</option>
                <option value="InWaterfall">In Waterfall</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Agreements Table */}
      {agreements.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-3">No agreements found.</p>
            <Link to="/upload" className="btn btn-primary">
              Upload Your First Agreement
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>File</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Parties</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agreements.map((agreement: Agreement) => (
                    <tr key={agreement.id}>
                      <td>
                        <strong>{agreement.title}</strong>
                        {agreement.description && (
                          <div className="text-muted small">{agreement.description}</div>
                        )}
                      </td>
                      <td>
                        <div>{agreement.file.name}</div>
                        <div className="text-muted small">
                          {formatFileSize(agreement.file.size)}
                        </div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(agreement.status)}>
                          {agreement.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {formatDate(agreement.updatedAt)}
                      </td>
                      <td>
                        {agreement.parties && agreement.parties.length > 0 ? (
                          <span className="badge bg-light text-dark">
                            {agreement.parties.length} {agreement.parties.length === 1 ? 'party' : 'parties'}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewAgreement(agreement.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Page {currentPage + 1} of {totalPages}
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i;
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum + 1}
                        </button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default AllAgreements;
