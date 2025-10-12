import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';
import WaterfallStepCard from './WaterfallStepCard';
import {
  type WaterfallDefinition,
  type WaterfallStep,
  SourceType,
} from 'deal-strata-client';

const WaterfallDetails: React.FC = () => {
  const { id, waterfallId } = useParams<{ id: string; waterfallId: string }>();
  const [waterfall, setWaterfall] = useState<WaterfallDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && waterfallId) {
      loadWaterfallData();
    }
  }, [id, waterfallId]);

  const loadWaterfallData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load the specific waterfall directly
      const response = await agreementApi.getWaterfallById({
        id: id!,
        waterfallId: waterfallId!
      });
      const waterfallData: WaterfallDefinition = response.data;
      setWaterfall(waterfallData);
    } catch (err) {
      let errorMessage = 'Failed to load waterfall';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
          message?: string;
        };
        
        errorMessage = axiosError.response?.data?.message || 
                      axiosError.response?.data?.error || 
                      axiosError.message || 
                      errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !waterfall) {
    return (
      <Layout>
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || 'Waterfall not found'}
        </div>
        <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Agreement
        </Link>
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
          <li className="breadcrumb-item">
            <Link to={`/agreements/${id}`}>Agreement Details</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Waterfall Details
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className="bi bi-diagram-3 me-2"></i>
              {waterfall.name}
            </h4>
            <span className={`badge ${waterfall.sourceDef === SourceType.Agreement ? 'bg-light text-dark' : 'bg-warning text-dark'}`}>
              {waterfall.sourceDef === SourceType.Agreement ? 'Agreement Defined' : 'User Defined'}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted small">Waterfall ID</label>
                <div className="fw-bold"><code>{waterfall.id}</code></div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted small">Number of Steps</label>
                <div className="fw-bold">{waterfall.steps.length}</div>
              </div>
            </div>
            {waterfall.sourceId && (
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="text-muted small">Source ID</label>
                  <div className="fw-bold"><code>{waterfall.sourceId}</code></div>
                </div>
              </div>
            )}
            {waterfall.notes && (
              <div className="col-12">
                <div className="mb-3">
                  <label className="text-muted small">Notes</label>
                  <div className="alert alert-light mb-0">
                    <i className="bi bi-sticky me-2"></i>
                    {waterfall.notes}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Waterfall Steps */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <i className="bi bi-list-ol me-2"></i>
            Waterfall Steps
          </h5>
        </div>
        <div className="card-body">
          {waterfall.steps && waterfall.steps.length > 0 ? (
            <div className="row g-3">
              {waterfall.steps.map((step: WaterfallStep, index: number) => (
                <div key={step.id} className="col-12">
                  <WaterfallStepCard step={step} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2">No waterfall steps defined</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 justify-content-between">
        <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Agreement
        </Link>
        <div className="d-flex gap-2">
          {waterfall.sourceDef === SourceType.User && (
            <button className="btn btn-outline-primary">
              <i className="bi bi-pencil me-1"></i>
              Edit Waterfall
            </button>
          )}
          <Link 
            to={`/agreements/${id}/calculations/new?waterfallId=${waterfallId}`}
            className="btn btn-primary"
          >
            <i className="bi bi-calculator me-1"></i>
            Create Calculation
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default WaterfallDetails;
