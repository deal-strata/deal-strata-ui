import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import {
  type AgreementApiGetAgreementByIdRequest,
  type AgreementApiGetCalculationsRequest,
  type Agreement,
  type AgreementStatus,
  type Calculation,
  SourceType,
} from 'deal-strata-client';

const AgreementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCalculations, setLoadingCalculations] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stepModalOpen, setStepModalOpen] = useState<boolean>(false);
  const [modalStepDetails, setModalStepDetails] = useState<any>(null);
  const [modalStepTitle, setModalStepTitle] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    details: true,
    waterfalls: true,
    calculations: true,
    parties: true,
    commitments: true,
    metadata: true,
  });

  useEffect(() => {
    if (id) {
      loadAgreement(id);
      loadCalculations(id);
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

  const loadCalculations = async (agreementId: string) => {
    try {
      setLoadingCalculations(true);

      const request: AgreementApiGetCalculationsRequest = {
        id: agreementId,
      };

      const response = await agreementApi.getCalculations(request);
      setCalculations(response.data);
    } catch (err) {
      console.error('Error loading calculations:', err);
      // Don't set error state for calculations, just log it
      // The main agreement data is more important
    } finally {
      setLoadingCalculations(false);
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

  // Removed unused helpers (formatCurrency, formatFileSize, getRoleBadgeClass)

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
            <Link
              to="/agreements"
              className="btn"
              style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }}
            >
              Back to All Agreements
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const displayedWaterfalls = agreement.waterfalls?.slice(0, 2);
  const primaryWaterfall = agreement.waterfalls && agreement.waterfalls.length > 0 ? agreement.waterfalls[0] : null;

  const formatStepType = (stepType: string): string => {
    const typeMap: Record<string, string> = {
      'ReturnOfCapital': 'Return of Capital',
      'PreferredRateHurdle': 'Preferred Rate Hurdle',
      'GPCatchUp': 'GP Catch-Up',
      'CarrySplit': 'Carry Split',
    };
    return typeMap[stepType] || (stepType || '').toString().replace(/([A-Z])/g, ' $1').trim();
  };

  const openStepModal = (step: any) => {
    setModalStepTitle(step.name || formatStepType(step.stepType) || `Step ${step.orderNumber || ''}`);
    setModalStepDetails(step.stepDetails || step.metrics || step);
    setStepModalOpen(true);
  };

  // Render details object/array in tabular form for business-friendly display
  const renderDetailsTable = (data: any, level = 0): any => {
    if (data == null) {
      return <div className="text-muted">No details available</div>;
    }

    if (typeof data !== 'object') {
      return <div>{String(data)}</div>;
    }

    if (Array.isArray(data)) {
      return (
        <table className="table table-sm table-bordered mb-0">
          <thead className="table-light"><tr><th style={{width: '60px'}}>#</th><th>Value</th></tr></thead>
          <tbody>
            {data.map((item: any, i: number) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{typeof item === 'object' ? renderDetailsTable(item, level + 1) : String(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Object
    return (
      <table className="table table-sm table-bordered mb-0">
        <tbody>
          {Object.entries(data).map(([k, v]) => (
            <tr key={k}>
              <th style={{ width: '220px', verticalAlign: 'top' }}>{k}</th>
              <td>{typeof v === 'object' && v !== null ? renderDetailsTable(v, level + 1) : String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const closeStepModal = () => {
    setStepModalOpen(false);
    setModalStepDetails(null);
    setModalStepTitle('');
  };

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
              {displayedWaterfalls?.map((waterfall: any) => (
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
                          className="btn btn-sm"
                          style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
              {/* ...existing code... */}
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
            className="btn"
            style={{ backgroundColor: '#46BDC6', borderColor: '#46BDC6', color: '#fff' }}
          >
            <i className="bi bi-pencil me-1"></i>
            Update Agreement
          </Link>
          <a
            href={agreement.file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }}
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

      {/* Top Info Table: Deal code, description, fund name, fund date (simplified) */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <tbody>
                <tr>
                  <th style={{ width: '180px' }}>Deal Code</th>
                  <td>{agreement.dealId || 'N/A'}</td>
                  <th style={{ width: '180px' }}>Fund Name</th>
                  <td>{agreement.file?.name || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td colSpan={3}>{agreement.description || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Fund Date</th>
                  <td colSpan={3}>{formatDate(agreement.file?.uploadedAt)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Waterfall Steps Table for primary waterfall */}
      {primaryWaterfall && primaryWaterfall.steps && primaryWaterfall.steps.length > 0 && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Waterfall Steps</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }}>Order</th>
                    <th>Step Name</th>
                    <th>Description</th>
                    <th>Section</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {primaryWaterfall.steps.map((step: any, idx: number) => (
                    <tr key={step.id || idx}>
                      <td>{step.orderNumber ?? (idx + 1)}</td>
                      <td className="fw-medium">{step.name || formatStepType(step.stepType)}</td>
                      <td className="text-muted small">{step.description || step.notes || (step.stepDetails && step.stepDetails.notes) || '—'}</td>
                      <td className="text-muted small">{step.sourceSection || step.section || step.sourceRef || 'N/A'}</td>
                        <td className="text-end">
                          <button className="btn btn-sm" style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }} onClick={() => openStepModal(step)}>
                            Details
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
              Calculations ({calculations.length})
            </h5>
          </button>
            {expandedSections.calculations && (
            <Link
              to={`/agreements/${agreement.id}/calculations/new`}
              className="btn btn-sm"
              style={{ backgroundColor: '#46BDC6', borderColor: '#46BDC6', color: '#fff' }}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Calculation
            </Link>
          )}
        </div>
        {expandedSections.calculations && (
          <div className="card-body p-0">
            {loadingCalculations ? (
              <div className="p-4 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading calculations...</span>
                </div>
                <p className="mt-2 text-muted">Loading calculations...</p>
              </div>
            ) : calculations.length === 0 ? (
                <div className="p-4 text-center text-muted">
                <i className="bi bi-calculator" style={{ fontSize: '2rem' }}></i>
                <p className="mb-3">No calculations yet</p>
                <Link
                  to={`/agreements/${agreement.id}/calculations/new`}
                  className="btn"
                  style={{ backgroundColor: '#46BDC6', borderColor: '#46BDC6', color: '#fff' }}
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
                      <th>Calculation Date</th>
                      <th>Waterfall</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.map((calc) => (
                      <tr key={calc.id} style={{ cursor: 'pointer' }}>
                        <td>
                          <Link
                            to={`/agreements/${agreement.id}/calculations/${calc.id}`}
                            className="text-decoration-none fw-medium"
                          >
                            {formatDate(calc.calculationDate)}
                          </Link>
                        </td>
                        <td className="text-muted small">
                          <code className="small">{calc.waterfallDefinitionId}</code>
                        </td>
                        <td className="text-muted small">{formatDate(calc.createdAt)}</td>
                        <td>
                          <span className={`badge ${
                            calc.status === 'Completed' ? 'bg-success' : 
                            calc.status === 'InProgress' ? 'bg-primary' : 
                            calc.status === 'Failed' ? 'bg-danger' : 
                            'bg-secondary'
                          }`}>
                            {calc.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/agreements/${agreement.id}/calculations/${calc.id}`}
                            className="btn btn-sm"
                            style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }}
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

      {/* Agreement Details removed per request */}

      {/* Parties section removed per request */}

      {/* Commitments section removed per request */}

      {/* Metadata removed per request */}

      {/* Action Buttons */}
      <div className="mt-4 d-flex gap-2">
        <Link
          to="/agreements"
          className="btn"
          style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to All Agreements
        </Link>
        <Link
          to="/upload"
          className="btn"
          style={{ backgroundColor: '#46BDC6', borderColor: '#46BDC6', color: '#fff' }}
        >
          <i className="bi bi-upload me-1"></i>
          Upload New Agreement
        </Link>
      </div>

      {/* Step Details Modal (simple Bootstrap-like modal controlled by state) */}
      {stepModalOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalStepTitle}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeStepModal}></button>
              </div>
              <div className="modal-body">
                {modalStepDetails ? (
                  <div>
                    <h6 className="mb-2">Metrics / Details</h6>
                    <div className="mb-3">
                      {renderDetailsTable(modalStepDetails)}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted">No details available for this step.</div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" style={{ borderColor: '#46BDC6', color: '#46BDC6', borderStyle: 'solid', borderWidth: '1px' }} onClick={closeStepModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgreementDetails;
