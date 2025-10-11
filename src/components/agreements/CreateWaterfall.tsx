import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';

const CreateWaterfall: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
            Create Waterfall
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">
            <i className="bi bi-plus-circle me-2"></i>
            Create Custom Waterfall
          </h4>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-diagram-3" style={{ fontSize: '4rem', color: '#198754' }}></i>
            <h3 className="mt-3 mb-2">Create Custom Waterfall Page</h3>
            <p className="text-muted mb-4">
              This page will allow you to define a custom waterfall with:<br />
              • Waterfall name and description<br />
              • Custom distribution steps<br />
              • LP/GP split percentages<br />
              • Thresholds and hurdle rates<br />
              • Preferred return settings<br />
              • Catch-up provisions
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Cancel
              </Link>
              <button className="btn btn-success" disabled>
                <i className="bi bi-save me-1"></i>
                Create Waterfall (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateWaterfall;
