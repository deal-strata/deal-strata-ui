import React from 'react';

interface PartyAllocation {
  partyId: string;
  percentage: number;
}

interface ReturnOfCapitalDetails {
  stepType: 'ReturnOfCapital';
  capitalBase: string;
  targetPercentage?: number;
  capAmount?: {
    amount: number;
    currency: string;
  };
  partyAllocations?: PartyAllocation[];
}

interface ReturnOfCapitalStepProps {
  details: ReturnOfCapitalDetails;
}

const ReturnOfCapitalStep: React.FC<ReturnOfCapitalStepProps> = ({ details }) => {
  const formatCapitalBase = (base: string): string => {
    const baseMap: Record<string, string> = {
      'PaidInCapital': 'Paid In Capital',
      'UnreturnedCapital': 'Unreturned Capital',
      'Commitment': 'Commitment',
    };
    return baseMap[base] || base;
  };

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
            <label className="text-muted small mb-1">Capital Base</label>
            <div className="fw-bold">
              <i className="bi bi-bank me-2 text-primary"></i>
              {formatCapitalBase(details.capitalBase)}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <label className="text-muted small mb-1">Target Percentage</label>
            <div className="fw-bold">
              <i className="bi bi-percent me-2 text-primary"></i>
              {details.targetPercentage ?? 100}%
            </div>
          </div>
        </div>

        {details.capAmount && (
          <div className="col-md-6">
            <div className="p-3 bg-light rounded">
              <label className="text-muted small mb-1">Cap Amount</label>
              <div className="fw-bold">
                <i className="bi bi-currency-dollar me-2 text-primary"></i>
                {formatCurrency(details.capAmount.amount, details.capAmount.currency)}
              </div>
            </div>
          </div>
        )}

        {details.partyAllocations && details.partyAllocations.length > 0 && (
          <div className="col-12">
            <div className="border-top pt-3">
              <label className="text-muted small mb-2">
                <i className="bi bi-people me-1"></i>
                Party Allocations
              </label>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Party ID</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.partyAllocations.map((allocation, index) => (
                      <tr key={index}>
                        <td><code>{allocation.partyId}</code></td>
                        <td>{allocation.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnOfCapitalStep;
