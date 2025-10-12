import React from 'react';

interface LPAllocation {
  partyId: string;
  percentage: number;
}

interface CarrySplitDetails {
  stepType: 'CarrySplit';
  gpCarryPercentage: number;
  lpPercentage?: number;
  gpPartyId?: string;
  lpAllocations?: LPAllocation[];
}

interface CarrySplitStepProps {
  details: CarrySplitDetails;
}

const CarrySplitStep: React.FC<CarrySplitStepProps> = ({ details }) => {
  const calculatedLpPercentage = details.lpPercentage ?? (100 - details.gpCarryPercentage);

  return (
    <div className="mt-3">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="p-3 bg-primary bg-opacity-10 rounded border border-primary">
            <label className="text-muted small mb-1">GP Carry Percentage</label>
            <div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>
              <i className="bi bi-star-fill me-2"></i>
              {details.gpCarryPercentage}%
            </div>
            <small className="text-muted">
              Carried interest to General Partner
            </small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 bg-success bg-opacity-10 rounded border border-success">
            <label className="text-muted small mb-1">LP Percentage</label>
            <div className="fw-bold text-success" style={{ fontSize: '1.5rem' }}>
              <i className="bi bi-people-fill me-2"></i>
              {calculatedLpPercentage}%
            </div>
            <small className="text-muted">
              Distribution to Limited Partners
            </small>
          </div>
        </div>

        {details.gpPartyId && (
          <div className="col-12">
            <div className="p-3 bg-light rounded">
              <label className="text-muted small mb-1">Specific GP Party</label>
              <div className="fw-bold">
                <i className="bi bi-person-badge me-2 text-primary"></i>
                <code>{details.gpPartyId}</code>
              </div>
              <small className="text-muted">
                Designated GP to receive carried interest
              </small>
            </div>
          </div>
        )}

        {details.lpAllocations && details.lpAllocations.length > 0 && (
          <div className="col-12">
            <div className="border-top pt-3">
              <label className="text-muted small mb-2">
                <i className="bi bi-people me-1"></i>
                LP-Specific Allocations
              </label>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>LP Party ID</th>
                      <th>Percentage of LP Portion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.lpAllocations.map((allocation, index) => (
                      <tr key={index}>
                        <td><code>{allocation.partyId}</code></td>
                        <td>{allocation.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <small className="text-muted">
                Custom allocation overrides for specific LPs
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="alert alert-success mt-3 mb-0">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Carry Split:</strong> Final distribution step splitting remaining profits between 
        GP ({details.gpCarryPercentage}% carry) and LPs ({calculatedLpPercentage}%). This is typically 
        the last step in a waterfall after all hurdles and catch-ups have been satisfied.
      </div>
    </div>
  );
};

export default CarrySplitStep;
