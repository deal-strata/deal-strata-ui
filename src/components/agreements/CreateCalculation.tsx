import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Layout from '../layout/Layout';

const CreateCalculation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const waterfallId = searchParams.get('waterfallId');

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
            New Calculation
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Calculation
          </h4>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-calculator" style={{ fontSize: '4rem', color: '#198754' }}></i>
            <h3 className="mt-3 mb-2">Create Calculation Page</h3>
            <p className="text-muted mb-4">
              This page will allow you to create a new calculation with:<br />
              • Select waterfall to use<br />
              • Define calculation name and description<br />
              • Input total distribution amount<br />
              • Set LP contributions and allocations<br />
              • Define custom parameters<br />
              • Preview distribution before saving
            </p>
            {waterfallId && (
              <div className="alert alert-info d-inline-block">
                <strong>Pre-selected Waterfall ID:</strong> <code>{waterfallId}</code>
              </div>
            )}
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Cancel
              </Link>
              <button className="btn btn-outline-primary" disabled>
                <i className="bi bi-eye me-1"></i>
                Preview (Coming Soon)
              </button>
              <button className="btn btn-success" disabled>
                <i className="bi bi-save me-1"></i>
                Create Calculation (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCalculation;
