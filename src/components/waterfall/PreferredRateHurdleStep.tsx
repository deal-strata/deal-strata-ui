import React from 'react';

interface PartyAllocation {
  partyId: string;
  percentage: number;
}

interface PreferredRateHurdleDetails {
  stepType: 'PreferredRateHurdle';
  hurdleType?: string;
  hurdleRate?: number;
  compoundingFrequency?: string;
  capitalBase: string;
  capAmount?: {
    amount: number;
    currency: string;
  };
  partyAllocations?: PartyAllocation[];
}

interface PreferredRateHurdleStepProps {
  details: PreferredRateHurdleDetails;
}

const PreferredRateHurdleStep: React.FC<PreferredRateHurdleStepProps> = ({ details }) => {
  const formatHurdleType = (type: string | undefined): string => {
    if (!type) return 'N/A';
    const typeMap: Record<string, string> = {
      'XIRR': 'XIRR (Internal Rate of Return)',
      'PreferredSimple': 'Preferred Simple',
      'PreferredCompounded': 'Preferred Compounded',
    };
    return typeMap[type] || type;
  };

  const formatCapitalBase = (base: string): string => {
    const baseMap: Record<string, string> = {
      'PaidInCapital': 'Paid In Capital',
      'UnreturnedCapital': 'Unreturned Capital',
      'Commitment': 'Commitment',
    };
    return baseMap[base] || base;
  };

  const formatCompoundingFrequency = (frequency: string | undefined): string => {
    if (!frequency) return 'N/A';
    const freqMap: Record<string, string> = {
      'Annual': 'Annual',
      'SemiAnnual': 'Semi-Annual',
      'Quarterly': 'Quarterly',
      'Monthly': 'Monthly',
      'Daily': 'Daily',
    };
    return freqMap[frequency] || frequency;
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
            <label className="text-muted small mb-1">Hurdle Type</label>
            <div className="fw-bold">
              <i className="bi bi-graph-up me-2 text-primary"></i>
              {formatHurdleType(details.hurdleType)}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <label className="text-muted small mb-1">Hurdle Rate</label>
            <div className="fw-bold">
              <i className="bi bi-percent me-2 text-primary"></i>
              {details.hurdleRate ?? 'N/A'}%
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-3 bg-light rounded">
            <label className="text-muted small mb-1">Capital Base</label>
            <div className="fw-bold">
              <i className="bi bi-bank me-2 text-primary"></i>
              {formatCapitalBase(details.capitalBase)}
            </div>
          </div>
        </div>

        {details.compoundingFrequency && (
          <div className="col-md-6">
            <div className="p-3 bg-light rounded">
              <label className="text-muted small mb-1">Compounding Frequency</label>
              <div className="fw-bold">
                <i className="bi bi-calendar-event me-2 text-primary"></i>
                {formatCompoundingFrequency(details.compoundingFrequency)}
              </div>
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

export default PreferredRateHurdleStep;
