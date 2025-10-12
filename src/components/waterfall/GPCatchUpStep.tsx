import React from 'react';

interface GPCatchUpDetails {
  stepType: 'GPCatchUp';
  catchupPercentage?: number;
  targetCarryPercentage?: number;
  capAmount?: {
    amount: number;
    currency: string;
  };
  gpPartyId?: string;
}

interface GPCatchUpStepProps {
  details: GPCatchUpDetails;
}

const GPCatchUpStep: React.FC<GPCatchUpStepProps> = ({ details }) => {
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="mt-3">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <label className="text-muted small mb-1">Catch-Up Percentage</label>
            <div className="fw-bold">
              <i className="bi bi-percent me-2 text-primary"></i>
              {details.catchupPercentage ?? 100}%
            </div>
            <small className="text-muted">
              Percentage of distributions going to GP
            </small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <label className="text-muted small mb-1">Target Carry Percentage</label>
            <div className="fw-bold">
              <i className="bi bi-bullseye me-2 text-primary"></i>
              {details.targetCarryPercentage ?? 'N/A'}%
            </div>
            <small className="text-muted">
              GP's target carry percentage
            </small>
          </div>
        </div>

        {details.gpPartyId && (
          <div className="col-md-6">
            <div className="p-3 bg-light rounded">
              <label className="text-muted small mb-1">Specific GP Party</label>
              <div className="fw-bold">
                <i className="bi bi-person-badge me-2 text-primary"></i>
                <code>{details.gpPartyId}</code>
              </div>
              <small className="text-muted">
                Designated GP to receive catch-up
              </small>
            </div>
          </div>
        )}

        {details.capAmount && (
          <div className="col-md-6">
            <div className="p-3 bg-light rounded">
              <label className="text-muted small mb-1">Cap Amount</label>
              <div className="fw-bold">
                <i className="bi bi-currency-dollar me-2 text-primary"></i>
                {formatCurrency(details.capAmount.amount, details.capAmount.currency)}
              </div>
              <small className="text-muted">
                Maximum catch-up amount
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="alert alert-info mt-3 mb-0">
        <i className="bi bi-info-circle me-2"></i>
        <strong>GP Catch-Up:</strong> Allows the GP to "catch up" to their target carry percentage 
        after investors have received their preferred return. Typically {details.catchupPercentage ?? 100}% 
        of distributions go to the GP until they reach {details.targetCarryPercentage ?? 20}% of total profits.
      </div>
    </div>
  );
};

export default GPCatchUpStep;
