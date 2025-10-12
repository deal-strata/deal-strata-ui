import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import type {
  Calculation,
  AgreementApiGetCalculationByIdRequest,
} from 'deal-strata-client';

const CalculationDetails: React.FC = () => {
  const { id, calculationId } = useParams<{ id: string; calculationId: string }>();
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalculationDetails = async () => {
      if (!id || !calculationId) {
        setError('Missing agreement ID or calculation ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const request: AgreementApiGetCalculationByIdRequest = {
          id,
          calculationId,
        };
        
        const response = await agreementApi.getCalculationById(request);
        setCalculation(response.data);
      } catch (err) {
        console.error('Error fetching calculation details:', err);
        
        let errorMessage = 'Failed to load calculation details';
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as {
            response?: {
              data?: {
                message?: string;
                error?: string;
              };
              status?: number;
            };
          };
          
          if (axiosError.response?.status === 404) {
            errorMessage = 'Calculation not found';
          } else {
            errorMessage = axiosError.response?.data?.message 
              || axiosError.response?.data?.error 
              || errorMessage;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculationDetails();
  }, [id, calculationId]);

  const formatCurrency = (money?: { amount: number; currency: string }): string => {
    if (!money) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currency || 'USD',
    }).format(money.amount);
  };

  const formatPercentage = (value?: number): string => {
    if (value === undefined || value === null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status?: string): string => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'InProgress':
        return 'bg-primary';
      case 'Pending':
        return 'bg-warning';
      case 'Failed':
        return 'bg-danger';
      default:
        return 'bg-secondary';
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
            Calculation Details
          </li>
        </ol>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading calculation details...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <div className="mt-2">
            <Link to={`/agreements/${id}`} className="btn btn-sm btn-outline-danger">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Agreement
            </Link>
          </div>
        </div>
      )}

      {/* Calculation Details */}
      {!loading && !error && calculation && (
        <>
          {/* Header Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-calculator me-2"></i>
                  Calculation Details
                </h4>
                <span className={`badge ${getStatusBadgeClass(calculation.status)}`}>
                  {calculation.status}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Calculation ID</label>
                  <div className="fw-bold"><code>{calculation.id}</code></div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Calculation Date</label>
                  <div className="fw-bold">{formatDate(calculation.calculationDate)}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Created At</label>
                  <div>{formatDateTime(calculation.createdAt)}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small">Completed At</label>
                  <div>{formatDateTime(calculation.completedAt)}</div>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="text-muted small">Waterfall Definition ID</label>
                  <div><code>{calculation.waterfallDefinitionId}</code></div>
                </div>
                {calculation.notes && (
                  <div className="col-md-12">
                    <label className="text-muted small">Notes</label>
                    <div className="alert alert-info mb-0">{calculation.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {calculation.summary && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  Summary & Metrics
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <div className="text-muted small">Total Capital Called</div>
                        <div className="h5 mb-0">{formatCurrency(calculation.summary.totalCapitalCalled)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <div className="text-muted small">Total Distributions</div>
                        <div className="h5 mb-0">{formatCurrency(calculation.summary.totalDistributions)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <div className="text-muted small">Total Fees</div>
                        <div className="h5 mb-0">{formatCurrency(calculation.summary.totalFees)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <div className="text-muted small">Net Distributions</div>
                        <div className="h5 mb-0">{formatCurrency(calculation.summary.netDistributions)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-muted small">Portfolio IRR</div>
                    <div className="h6 mb-0">{formatPercentage(calculation.summary.portfolioIrr)}</div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-muted small">Portfolio Multiple</div>
                    <div className="h6 mb-0">{calculation.summary.portfolioMultiple?.toFixed(2) || 'N/A'}x</div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-muted small">LP IRR</div>
                    <div className="h6 mb-0">{formatPercentage(calculation.summary.lpIrr)}</div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-muted small">GP Carry Percentage</div>
                    <div className="h6 mb-0">{formatPercentage(calculation.summary.gpCarryPercentage)}</div>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <div className="text-muted small">GP Carry Earned</div>
                    <div className="h6 mb-0">{formatCurrency(calculation.summary.gpCarryEarned)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Waterfall Step Results */}
          {calculation.stepResults && calculation.stepResults.length > 0 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-diagram-3-fill me-2"></i>
                  Waterfall Step Results
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Step #</th>
                        <th>Step Type</th>
                        <th>Amount Processed</th>
                        <th>Amount Remaining</th>
                        <th>Transactions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.stepResults.map((step, index) => (
                        <tr key={step.stepId || index}>
                          <td>{step.orderNumber}</td>
                          <td>
                            <span className="badge bg-secondary">{step.stepType}</span>
                          </td>
                          <td>{formatCurrency(step.amountProcessed)}</td>
                          <td>{formatCurrency(step.amountRemaining)}</td>
                          <td>
                            {step.transactions && step.transactions.length > 0 ? (
                              <span className="badge bg-primary">{step.transactions.length}</span>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Transactions */}
          {calculation.transactions && calculation.transactions.length > 0 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-warning">
                <h5 className="mb-0">
                  <i className="bi bi-cash-stack me-2"></i>
                  Transactions ({calculation.transactions.length})
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Party</th>
                        <th>Amount</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculation.transactions.map((transaction, index) => (
                        <tr key={transaction.id || index}>
                          <td>{formatDate(transaction.date)}</td>
                          <td>
                            <span className={`badge ${transaction.direction === 'In' ? 'bg-success' : 'bg-danger'}`}>
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td>{transaction.partyId || 'N/A'}</td>
                          <td>{formatCurrency(transaction.amount)}</td>
                          <td>{transaction.memo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4">
            <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Agreement
            </Link>
            <button className="btn btn-outline-success" disabled>
              <i className="bi bi-file-earmark-spreadsheet me-1"></i>
              Export Excel (Coming Soon)
            </button>
            <button className="btn btn-outline-primary" disabled>
              <i className="bi bi-file-earmark-pdf me-1"></i>
              Export PDF (Coming Soon)
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CalculationDetails;
