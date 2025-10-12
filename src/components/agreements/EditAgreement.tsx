import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';

const EditAgreement: React.FC = () => {
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
            Edit Agreement
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-pencil me-2"></i>
            Edit Agreement
          </h4>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-tools" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            <h3 className="mt-3 mb-2">Edit Agreement Page</h3>
            <p className="text-muted mb-4">
              This page will allow you to update agreement parameters including:<br />
              • Title and Description<br />
              • Associated Deal<br />
              • Parties and Roles<br />
              • Commitments<br />
              • Metadata
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Details
              </Link>
              <button className="btn btn-primary" disabled>
                <i className="bi bi-save me-1"></i>
                Save Changes (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditAgreement;
