import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';

const WaterfallDetails: React.FC = () => {
  const { id, waterfallId } = useParams<{ id: string; waterfallId: string }>();

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

      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">
            <i className="bi bi-diagram-3 me-2"></i>
            Waterfall Details
          </h4>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-diagram-3-fill" style={{ fontSize: '4rem', color: '#0dcaf0' }}></i>
            <h3 className="mt-3 mb-2">Waterfall Details Page</h3>
            <p className="text-muted mb-4">
              This page will display detailed waterfall information including:<br />
              • Waterfall steps and distribution logic<br />
              • Split percentages (LP/GP)<br />
              • Thresholds and hurdle rates<br />
              • Visual waterfall diagram<br />
              • Edit waterfall parameters (for user-defined waterfalls)
            </p>
            <div className="alert alert-info d-inline-block">
              <strong>Waterfall ID:</strong> <code>{waterfallId}</code>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Agreement
              </Link>
              <Link 
                to={`/agreements/${id}/calculations/new?waterfallId=${waterfallId}`}
                className="btn btn-primary"
              >
                <i className="bi bi-calculator me-1"></i>
                Create Calculation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaterfallDetails;
