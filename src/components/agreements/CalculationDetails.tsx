import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../layout/Layout';

const CalculationDetails: React.FC = () => {
  const { id, calculationId } = useParams<{ id: string; calculationId: string }>();

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

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-calculator me-2"></i>
            Calculation Details
          </h4>
        </div>
        <div className="card-body">
          <div className="text-center py-5">
            <i className="bi bi-calculator-fill" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
            <h3 className="mt-3 mb-2">Calculation Details Page</h3>
            <p className="text-muted mb-4">
              This page will display calculation results including:<br />
              • Total distribution amount<br />
              • Step-by-step distribution breakdown<br />
              • LP and GP allocations<br />
              • Input parameters used<br />
              • Export to Excel/PDF<br />
              • Comparison with other calculations
            </p>
            <div className="alert alert-info d-inline-block">
              <strong>Calculation ID:</strong> <code>{calculationId}</code>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link to={`/agreements/${id}`} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Agreement
              </Link>
              <button className="btn btn-outline-success" disabled>
                <i className="bi bi-file-earmark-spreadsheet me-1"></i>
                Export Excel (Coming Soon)
              </button>
              <button className="btn btn-primary" disabled>
                <i className="bi bi-pencil me-1"></i>
                Edit Calculation (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalculationDetails;
