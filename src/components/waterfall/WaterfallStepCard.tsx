import React from 'react';
import type { WaterfallStep, ProRataKey } from 'deal-strata-client';
import ReturnOfCapitalStep from './ReturnOfCapitalStep';
import PreferredRateHurdleStep from './PreferredRateHurdleStep';
import GPCatchUpStep from './GPCatchUpStep';
import CarrySplitStep from './CarrySplitStep';

interface WaterfallStepCardProps {
  step: WaterfallStep;
  index: number;
}

const WaterfallStepCard: React.FC<WaterfallStepCardProps> = ({ step, index }) => {
  const formatStepType = (stepType: string): string => {
    const typeMap: Record<string, string> = {
      'ReturnOfCapital': 'Return of Capital',
      'PreferredRateHurdle': 'Preferred Rate Hurdle',
      'GPCatchUp': 'GP Catch-Up',
      'CarrySplit': 'Carry Split',
    };
    return typeMap[stepType] || stepType.replace(/([A-Z])/g, ' $1').trim();
  };

  const getStepTypeIcon = (stepType: string): string => {
    const iconMap: Record<string, string> = {
      'ReturnOfCapital': 'bi-arrow-return-left',
      'PreferredRateHurdle': 'bi-percent',
      'GPCatchUp': 'bi-arrow-up-circle',
      'CarrySplit': 'bi-star',
    };
    return iconMap[stepType] || 'bi-diagram-3';
  };

  const getStepTypeBadgeColor = (stepType: string): string => {
    const colorMap: Record<string, string> = {
      'ReturnOfCapital': 'bg-primary',
      'PreferredRateHurdle': 'bg-info',
      'GPCatchUp': 'bg-warning text-dark',
      'CarrySplit': 'bg-success',
    };
    return colorMap[stepType] || 'bg-secondary';
  };

  const formatProRataKey = (key: ProRataKey | undefined): string => {
    if (!key) return 'N/A';
    
    const keyMap: Record<string, string> = {
      'ByCommitment': 'By Commitment',
      'ByUnreturnedCapital': 'By Unreturned Capital',
      'ByPaidInCapital': 'By Paid In Capital',
      'ByCustomWeights': 'By Custom Weights',
    };
    
    return keyMap[key] || key;
  };

  const renderStepDetails = () => {
    if (!step.stepDetails) {
      return (
        <div className="text-muted small mt-3">
          <i className="bi bi-info-circle me-1"></i>
          No additional details configured for this step
        </div>
      );
    }

    const stepType = step.stepDetails.stepType;

    switch (stepType) {
      case 'ReturnOfCapital':
        return <ReturnOfCapitalStep details={step.stepDetails as any} />;
      case 'PreferredRateHurdle':
        return <PreferredRateHurdleStep details={step.stepDetails as any} />;
      case 'GPCatchUp':
        return <GPCatchUpStep details={step.stepDetails as any} />;
      case 'CarrySplit':
        return <CarrySplitStep details={step.stepDetails as any} />;
      default:
        return (
          <div className="text-muted small mt-3">
            <i className="bi bi-question-circle me-1"></i>
            Unknown step type: {stepType}
          </div>
        );
    }
  };

  return (
    <div className="card border-start border-4" style={{ borderLeftColor: getStepTypeBadgeColor(step.stepType).includes('primary') ? '#0d6efd' : getStepTypeBadgeColor(step.stepType).includes('info') ? '#0dcaf0' : getStepTypeBadgeColor(step.stepType).includes('warning') ? '#ffc107' : '#198754' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <div 
              className={`badge ${getStepTypeBadgeColor(step.stepType)} rounded-circle d-flex align-items-center justify-content-center`}
              style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}
            >
              {index + 1}
            </div>
            <div>
              <h6 className="mb-1">
                <i className={`bi ${getStepTypeIcon(step.stepType)} me-2`}></i>
                {formatStepType(step.stepType)}
              </h6>
              <div className="d-flex gap-2 align-items-center">
                <span className={`badge ${getStepTypeBadgeColor(step.stepType)}`}>
                  {step.stepType}
                </span>
                <small className="text-muted">
                  Step ID: <code>{step.id}</code>
                </small>
              </div>
            </div>
          </div>
          <span className="badge bg-light text-dark border">
            Order: {step.orderNumber}
          </span>
        </div>

        {step.proRataKey && (
          <div className="mb-3">
            <div className="p-2 bg-light rounded d-inline-flex align-items-center">
              <i className="bi bi-key me-2 text-primary"></i>
              <span className="small">
                <strong>Pro Rata Key:</strong> {formatProRataKey(step.proRataKey)}
              </span>
            </div>
          </div>
        )}

        {renderStepDetails()}
      </div>
    </div>
  );
};

export default WaterfallStepCard;
