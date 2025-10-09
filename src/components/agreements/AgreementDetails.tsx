import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Layout from '../layout/Layout';
import { documentsApi } from '../../services';
import type { LPADocument } from '../../types';

const AgreementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<LPADocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    summary: true,
    metrics: true,
    steps: true,
  });

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  const loadDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await documentsApi.getLPA(documentId);

      if (response.success && response.data) {
        setDocument(response.data);
      } else {
        setError(response.error || 'Failed to load document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
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

  const exportToExcel = () => {
    if (!document || !document.WaterfallSteps) return;

    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['Document Information'],
      ['Filename', document.filename],
      ['Status', document.status],
      ['Uploaded', formatDate(document.uploadedAt)],
      document.processedAt ? ['Processed', formatDate(document.processedAt)] : [],
      [],
      ['Waterfall Metrics'],
      document.WaterfallMetrics ? ['Total Distribution', document.WaterfallMetrics['Total Distribution']] : [],
      document.WaterfallMetrics ? ['Number of Steps', document.WaterfallMetrics['Number of Steps']] : [],
      document.WaterfallMetrics ? ['Distribution Type', document.WaterfallMetrics['Distribution Type']] : [],
      document.WaterfallMetrics ? ['Management Fee', `${document.WaterfallMetrics['Management Fee']}%`] : [],
      document.WaterfallMetrics ? ['Carried Interest', `${document.WaterfallMetrics['Carried Interest']}%`] : [],
    ].filter(row => row.length > 0);

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Waterfall steps sheet
    const stepsData = document.WaterfallSteps.map(step => ({
      'Step Number': step.StepNumber,
      'Description': step.Description,
      'Threshold': step.Threshold,
      'LP Split (%)': step.Split.LPs,
      'GP Split (%)': step.Split.GP,
      'Amount Distributed': step['Amount Distributed'],
    }));

    const stepsSheet = XLSX.utils.json_to_sheet(stepsData);
    XLSX.utils.book_append_sheet(workbook, stepsSheet, 'Waterfall Steps');

    // Export
    const fileName = `${document.filename.replace(/\.[^/.]+$/, '')}_Analysis.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToCSV = () => {
    if (!document || !document.WaterfallSteps) return;

    const csvContent = [
      ['Step Number', 'Description', 'Threshold', 'LP Split (%)', 'GP Split (%)', 'Amount Distributed'],
      ...document.WaterfallSteps.map(step => [
        step.StepNumber,
        step.Description,
        step.Threshold,
        step.Split.LPs,
        step.Split.GP,
        step['Amount Distributed'],
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${document.filename.replace(/\.[^/.]+$/, '')}_Waterfall.csv`;
    saveAs(blob, fileName);
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

  if (error || !document) {
    return (
      <Layout>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Document</h4>
          <p>{error || 'Document not found'}</p>
          <hr />
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={() => id && loadDocument(id)}>
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

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/agreements">All Agreements</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {document.filename}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="mb-2">{document.filename}</h2>
          <div className="d-flex gap-3 align-items-center">
            <span className={getStatusBadgeClass(document.status)}>
              {document.status.toUpperCase()}
            </span>
            <span className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              Uploaded: {formatDate(document.uploadedAt)}
            </span>
            {document.processedAt && (
              <span className="text-muted">
                <i className="bi bi-check-circle me-1"></i>
                Processed: {formatDate(document.processedAt)}
              </span>
            )}
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportToExcel}>
            <i className="bi bi-file-earmark-spreadsheet me-1"></i>
            Export Excel
          </button>
          <button className="btn btn-outline-primary" onClick={exportToCSV}>
            <i className="bi bi-filetype-csv me-1"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Processing Status */}
      {document.status === 'processing' && (
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-hourglass-split me-2"></i>
          This document is currently being processed. Results will be available once processing is complete.
        </div>
      )}

      {document.status === 'failed' && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Document processing failed. Please try uploading the document again.
        </div>
      )}

      {/* Main Content - Only show if completed */}
      {document.status === 'completed' && (
        <>
          {/* Waterfall Summary */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-white">
              <button
                className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
                onClick={() => toggleSection('summary')}
              >
                <h5 className="mb-0">
                  <i className={`bi bi-chevron-${expandedSections.summary ? 'down' : 'right'} me-2`}></i>
                  Waterfall Summary
                </h5>
              </button>
            </div>
            {expandedSections.summary && (
              <div className="card-body">
                <p className="mb-0">{document.WaterfallSummary}</p>
              </div>
            )}
          </div>

          {/* Waterfall Metrics */}
          {document.WaterfallMetrics && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white">
                <button
                  className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
                  onClick={() => toggleSection('metrics')}
                >
                  <h5 className="mb-0">
                    <i className={`bi bi-chevron-${expandedSections.metrics ? 'down' : 'right'} me-2`}></i>
                    Key Metrics
                  </h5>
                </button>
              </div>
              {expandedSections.metrics && (
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                      <div className="p-3 bg-light rounded text-center">
                        <div className="text-muted small mb-1">Total Distribution</div>
                        <h4 className="mb-0 text-primary">
                          {formatCurrency(document.WaterfallMetrics['Total Distribution'])}
                        </h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <div className="p-3 bg-light rounded text-center">
                        <div className="text-muted small mb-1">Distribution Type</div>
                        <h5 className="mb-0">{document.WaterfallMetrics['Distribution Type']}</h5>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <div className="p-3 bg-light rounded text-center">
                        <div className="text-muted small mb-1">Number of Steps</div>
                        <h4 className="mb-0">{document.WaterfallMetrics['Number of Steps']}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <div className="p-3 bg-light rounded text-center">
                        <div className="text-muted small mb-1">Management Fee</div>
                        <h4 className="mb-0">{formatPercentage(document.WaterfallMetrics['Management Fee'])}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <div className="p-3 bg-light rounded text-center">
                        <div className="text-muted small mb-1">Carried Interest</div>
                        <h4 className="mb-0 text-success">
                          {formatPercentage(document.WaterfallMetrics['Carried Interest'])}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Waterfall Steps */}
          {document.WaterfallSteps && document.WaterfallSteps.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <button
                  className="btn btn-link text-decoration-none text-dark w-100 text-start p-0"
                  onClick={() => toggleSection('steps')}
                >
                  <h5 className="mb-0">
                    <i className={`bi bi-chevron-${expandedSections.steps ? 'down' : 'right'} me-2`}></i>
                    Waterfall Distribution Steps
                  </h5>
                </button>
              </div>
              {expandedSections.steps && (
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Step</th>
                          <th>Description</th>
                          <th>Threshold</th>
                          <th className="text-end">LP Split</th>
                          <th className="text-end">GP Split</th>
                          <th className="text-end">Amount Distributed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {document.WaterfallSteps.map((step, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge bg-primary">{step.StepNumber}</span>
                            </td>
                            <td><strong>{step.Description}</strong></td>
                            <td>{typeof step.Threshold === 'number' ? `${step.Threshold}%` : step.Threshold}</td>
                            <td className="text-end">
                              <span className="badge bg-info">{formatPercentage(step.Split.LPs)}</span>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-success">{formatPercentage(step.Split.GP)}</span>
                            </td>
                            <td className="text-end">
                              <strong>{formatCurrency(step['Amount Distributed'])}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <th colSpan={5} className="text-end">Total Distribution:</th>
                          <th className="text-end">
                            {formatCurrency(
                              document.WaterfallSteps.reduce((sum, step) => sum + step['Amount Distributed'], 0)
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
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-4 d-flex gap-2">
        <Link to="/agreements" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Back to All Agreements
        </Link>
        <Link to="/upload" className="btn btn-outline-primary">
          <i className="bi bi-upload me-1"></i>
          Upload New Document
        </Link>
      </div>
    </Layout>
  );
};

export default AgreementDetails;
