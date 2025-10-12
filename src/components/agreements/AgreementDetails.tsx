import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import {
  type AgreementApiGetAgreementByIdRequest,
  type Agreement,
  type AgreementStatus,
  type AgreementParty,
  type AgreementCommitment,
  SourceType,
} from 'deal-strata-client';

const AgreementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    details: true,
    waterfalls: true,
    calculations: true,
    parties: true,
    commitments: true,
    metadata: true,
  });

  // Mock data for calculations (will be replaced with API calls)
  const mockCalculations = [
    {
      id: 'calc-1',
      name: 'Q3 2024 Distribution',
      waterfallId: 'waterfall-1',
      waterfallName: 'Agreement Waterfall',
      totalDistribution: 5000000,
      createdAt: '2024-10-01T09:00:00Z',
      status: 'completed' as const,
    },
    {
      id: 'calc-2',
      name: 'Q4 2024 Projection',
      waterfallId: 'waterfall-1',
      waterfallName: 'Agreement Waterfall',
      totalDistribution: 7500000,
      createdAt: '2024-10-10T14:30:00Z',
      status: 'draft' as const,
    },
  ];

  useEffect(() => {
    if (id) {
      loadAgreement(id);
    }
  }, [id]);

  const loadAgreement = async (agreementId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create explicit request object
      const request: AgreementApiGetAgreementByIdRequest = {
        id: agreementId,
      };

      const response = await agreementApi.getAgreementById(request);
      const data: Agreement = response.data;

      setAgreement(data);
    } catch (err) {
      let errorMessage = 'Failed to load agreement';

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
      case 'NotStarted':
        return 'badge bg-light text-dark';
      default:
        return 'badge bg-secondary';
    }
  };

  const getRoleBadgeClass = (role: string): string => {
    return role === 'LP' ? 'badge bg-info' : 'badge bg-success';
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading agreement details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !agreement) {
    return (
      <Layout>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Agreement</h4>
          <p>{error || 'Agreement not found'}</p>
          <hr />
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={() => id && loadAgreement(id)}>
              Try Again
            </button>
            <Link to="/agreements" className="btn btn-outline-secondary">
              Back to All Agreements
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const displayedWaterfalls = agreement.waterfalls?.slice(0, 2);

  const waterfallSection = (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <button
          className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
          onClick={() => toggleSection('waterfalls')}
        >
          <h5 className="mb-0">
            <i className={`bi bi-chevron-${expandedSections.waterfalls ? 'down' : 'right'} me-2`}></i>
            Waterfall Configuration
          </h5>
        </button>
      </div>
      {expandedSections.waterfalls && (
        <div className="card-body">
          <div className="row g-3">
              {displayedWaterfalls?.map((waterfall) => (
              <div key={waterfall.id} className="col-md-6">
                <div className="card hover-shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="card-title mb-0">{waterfall.name}</h6>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className={`badge ${waterfall.sourceDef === SourceType.Agreement ? 'bg-primary' : 'bg-success'}`}>
                            {waterfall.sourceDef === SourceType.Agreement ? 'Original' : 'User Edited'}
                          </span>
                          <small className="text-muted">{waterfall.steps.length} steps</small>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/agreements/${agreement.id}/waterfalls/${waterfall.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            Waterfall configuration can be edited on the <Link to={`/agreements/${agreement.id}/edit`}>Edit Agreement</Link> page
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/agreements">All Agreements</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {agreement.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="mb-2">{agreement.title}</h2>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <span className={getStatusBadgeClass(agreement.status)}>
              {agreement.status || 'Unknown'}
            </span>
            <span className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              Updated: {formatDate(agreement.updatedAt)}
            </span>
            {agreement.dealId && (
              <span className="text-muted">
                <i className="bi bi-briefcase me-1"></i>
                Deal: {agreement.dealId}
              </span>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link
            to={`/agreements/${agreement.id}/edit`}
            className="btn btn-primary"
          >
            <i className="bi bi-pencil me-1"></i>
            Update Agreement
          </Link>
          <a
            href={agreement.file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-download me-1"></i>
            Download File
          </a>
        </div>
      </div>

      {/* Processing Status Alerts */}
      {agreement.status === 'Processing' && (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-hourglass-split me-2"></i>
          This agreement is currently being processed. Full details will be available once processing is complete.
        </div>
      )}

      {/* Waterfall Section */}
      {waterfallSection}

      {/* Calculations Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <button
            className="btn btn-link text-decoration-none text-dark p-0"
            onClick={() => toggleSection('calculations')}
          >
            <h5 className="mb-0">
              <i className={`bi bi-chevron-${expandedSections.calculations ? 'down' : 'right'} me-2`}></i>
              Calculations ({mockCalculations.length})
            </h5>
          </button>
          {expandedSections.calculations && (
            <Link
              to={`/agreements/${agreement.id}/calculations/new`}
              className="btn btn-sm btn-primary"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Calculation
            </Link>
          )}
        </div>
        {expandedSections.calculations && (
          <div className="card-body p-0">
            {mockCalculations.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="bi bi-calculator" style={{ fontSize: '2rem' }}></i>
                <p className="mb-3">No calculations yet</p>
                <Link
                  to={`/agreements/${agreement.id}/calculations/new`}
                  className="btn btn-primary"
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Create First Calculation
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Calculation Name</th>
                      <th>Waterfall</th>
                      <th className="text-end">Total Distribution</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCalculations.map((calc) => (
                      <tr key={calc.id} style={{ cursor: 'pointer' }}>
                        <td>
                          <Link
                            to={`/agreements/${agreement.id}/calculations/${calc.id}`}
                            className="text-decoration-none fw-medium"
                          >
                            {calc.name}
                          </Link>
                        </td>
                        <td className="text-muted small">{calc.waterfallName}</td>
                        <td className="text-end fw-medium">
                          {formatCurrency(calc.totalDistribution)}
                        </td>
                        <td className="text-muted small">{formatDate(calc.createdAt)}</td>
                        <td>
                          <span className={`badge ${calc.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>
                            {calc.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/agreements/${agreement.id}/calculations/${calc.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agreement Details Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white">
          <button
            className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
            onClick={() => toggleSection('details')}
          >
            <h5 className="mb-0">
              <i className={`bi bi-chevron-${expandedSections.details ? 'down' : 'right'} me-2`}></i>
              Agreement Details
            </h5>
          </button>
        </div>
        {expandedSections.details && (
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">Agreement ID</label>
                  <div className="fw-medium"><code>{agreement.id}</code></div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">Status</label>
                  <div>
                    <span className={getStatusBadgeClass(agreement.status)}>
                      {agreement.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              {agreement.description && (
                <div className="col-12">
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Description</label>
                    <div>{agreement.description}</div>
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">File Name</label>
                  <div className="fw-medium">{agreement.file.name}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">File Size</label>
                  <div>{formatFileSize(agreement.file.size)}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">MIME Type</label>
                  <div><code>{agreement.file.mimeType || 'N/A'}</code></div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small mb-1">Uploaded At</label>
                  <div>{formatDate(agreement.file.uploadedAt)}</div>
                </div>
              </div>
              {agreement.file.uploadedBy && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Uploaded By</label>
                    <div>{agreement.file.uploadedBy}</div>
                  </div>
                </div>
              )}
              {agreement.file.checksum && (
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="text-muted small mb-1">Checksum</label>
                    <div><code className="small">{agreement.file.checksum}</code></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Parties Card */}
      {agreement.parties && agreement.parties.length > 0 && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-white">
            <button
              className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
              onClick={() => toggleSection('parties')}
            >
              <h5 className="mb-0">
                <i className={`bi bi-chevron-${expandedSections.parties ? 'down' : 'right'} me-2`}></i>
                Parties ({agreement.parties.length})
              </h5>
            </button>
          </div>
          {expandedSections.parties && (
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Party ID</th>
                      <th>User ID</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreement.parties.map((party: AgreementParty) => (
                      <tr key={party.id}>
                        <td><code>{party.id}</code></td>
                        <td><code>{party.userId}</code></td>
                        <td>
                          <span className={getRoleBadgeClass(party.role)}>
                            {party.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Commitments Card */}
      {agreement.commitments && agreement.commitments.length > 0 && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-white">
            <button
              className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
              onClick={() => toggleSection('commitments')}
            >
              <h5 className="mb-0">
                <i className={`bi bi-chevron-${expandedSections.commitments ? 'down' : 'right'} me-2`}></i>
                Commitments ({agreement.commitments.length})
              </h5>
            </button>
          </div>
          {expandedSections.commitments && (
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Commitment ID</th>
                      <th>LP ID</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreement.commitments.map((commitment: AgreementCommitment) => (
                      <tr key={commitment.id}>
                        <td><code>{commitment.id}</code></td>
                        <td><code>{commitment.lpId}</code></td>
                        <td className="text-end">
                          <strong>{formatCurrency(commitment.amount.amount, commitment.amount.currency)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <th colSpan={2} className="text-end">Total Commitments:</th>
                      <th className="text-end">
                        {formatCurrency(
                          agreement.commitments.reduce((sum, c) => sum + c.amount.amount, 0),
                          agreement.commitments[0]?.amount.currency || 'USD'
                        )}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metadata Card */}
      {agreement.metadata && Object.keys(agreement.metadata).length > 0 && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-white">
            <button
              className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
              onClick={() => toggleSection('metadata')}
            >
              <h5 className="mb-0">
                <i className={`bi bi-chevron-${expandedSections.metadata ? 'down' : 'right'} me-2`}></i>
                Metadata
              </h5>
            </button>
          </div>
          {expandedSections.metadata && (
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(agreement.metadata).map(([key, value]) => (
                  <div className="col-md-6" key={key}>
                    <div className="mb-2">
                      <label className="text-muted small mb-1">{key}</label>
                      <div className="fw-medium">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 d-flex gap-2">
        <Link to="/agreements" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Back to All Agreements
        </Link>
        <Link to="/upload" className="btn btn-outline-primary">
          <i className="bi bi-upload me-1"></i>
          Upload New Agreement
        </Link>
      </div>
    </Layout>
  );
};

export default AgreementDetails;
