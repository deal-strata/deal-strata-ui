import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Layout from '../layout/Layout';
import { documentsApi } from '../../services';
import type { LPADocument } from '../../types';

interface WaterfallStep {
  StepNumber?: number;
  Description?: string;
  Threshold?: string | number;
  Split?: {
    LPs: number;
    GP: number;
  };
  "Amount Distributed"?: number;
  [key: string]: any;
}

interface WaterfallMetrics {
  "Total Distribution"?: number;
  "Number of Steps"?: number;
  "Distribution Type"?: string;
  "Management Fee"?: number;
  "Carried Interest"?: number;
  [key: string]: any;
}

interface ResultsData {
  WaterfallSummary?: string;
  WaterfallMetrics?: WaterfallMetrics;
  WaterfallSteps?: WaterfallStep[];
  [key: string]: any;
}

interface LocationState {
  data?: ResultsData;
  documentId?: string;
}

interface CollapsibleSectionProps {
  id: string;
  buttonText: string;
  content: ReactNode;
}

interface ExpandedSections {
  [key: string]: boolean;
}

const Results: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [data, setData] = useState<ResultsData | undefined>(state?.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  // Load document if documentId is provided instead of data
  useEffect(() => {
    const loadDocument = async () => {
      if (!state?.data && state?.documentId) {
        setLoading(true);
        try {
          const response = await documentsApi.getLPA(state.documentId);
          if (response.success && response.data) {
            setData(response.data as any);
          }
        } catch (error) {
          console.error('Failed to load document:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDocument();
  }, [state?.documentId, state?.data]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading document...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to upload if no data
  if (!data) {
    return <Navigate to="/" replace />;
  }

  // Generate unique ID for collapsible sections
  const generateId = (): string => Math.random().toString(36).substr(2, 9);

  // Recursive renderer with collapsible sub-tables
  const renderValue = (val: any, depth: number = 0, visited = new WeakSet()): ReactNode => {
    const maxDepth = 5;
    if (depth > maxDepth) return <em>Max depth reached...</em>;

    if (val && typeof val === "object") {
      if (visited.has(val)) return <em>[Circular Reference]</em>;
      visited.add(val);
    }

    if (typeof val === "number") {
      return val <= 100 ? `${val.toFixed(2)}%` : val.toFixed(2);
    }

    if (Array.isArray(val)) {
      if (val.length === 0) return <em>Empty array</em>;
      
      if (val.every(item => typeof item !== "object")) {
        return (
          <ul className="list-group mb-0">
            {val.map((v, idx) => (
              <li key={idx} className="list-group-item">
                {renderValue(v, depth + 1, visited)}
              </li>
            ))}
          </ul>
        );
      } else {
        const headers = [...new Set(val.flatMap(item => Object.keys(item)))];
        const collapseId = `collapse-array-${generateId()}`;
        
        return (
          <CollapsibleSection 
            id={collapseId} 
            buttonText="Toggle Array"
            content={
              <table className="table table-sm table-bordered table-striped mb-2">
                <thead className="table-light">
                  <tr>
                    {headers.map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {val.map((item, idx) => (
                    <tr key={idx}>
                      {headers.map(h => (
                        <td key={h}>{renderValue(item[h], depth + 1, visited)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          />
        );
      }
    }

    if (typeof val === "object" && val !== null) {
      const keys = Object.keys(val);
      if (keys.length === 0) return <em>Empty object</em>;
      
      const collapseId = `collapse-obj-${generateId()}`;
      
      return (
        <CollapsibleSection
          id={collapseId}
          buttonText="Toggle Object"
          content={
            <table className="table table-sm table-bordered mb-0">
              <tbody>
                {keys.map(k => (
                  <tr key={k}>
                    <th className="bg-light">{k}</th>
                    <td>{renderValue(val[k], depth + 1, visited)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />
      );
    }

    return val === null ? <em>null</em> : val.toString();
  };

  // Collapsible section component
  const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ id, buttonText, content }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggle = (): void => {
      setIsExpanded(!isExpanded);
      setExpandedSections(prev => ({ ...prev, [id]: !isExpanded }));
    };

    return (
      <>
        <button 
          className="btn btn-sm btn-secondary mb-1" 
          onClick={toggle}
          type="button"
        >
          {buttonText}
        </button>
        <div className={`collapse ${isExpanded ? 'show' : ''}`}>
          {content}
        </div>
      </>
    );
  };

  // Toggle all collapse elements
  const toggleAll = (expand: boolean = true): void => {
    const newExpandedState: ExpandedSections = {};
    Object.keys(expandedSections).forEach(key => {
      newExpandedState[key] = expand;
    });
    setExpandedSections(newExpandedState);
  };

  // Flatten JSON for row-wise export
  const flattenForRowExport = (obj: any, prefix: string = "", res: [string, any][] = []): [string, any][] => {
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const newKey = prefix ? `${prefix} - ${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            if (typeof item === "object" && item !== null) {
              flattenForRowExport(item, `${newKey}[${index}]`, res);
            } else {
              res.push([`${newKey}[${index}]`, item]);
            }
          });
        } else {
          flattenForRowExport(obj[key], newKey, res);
        }
      } else {
        res.push([newKey, obj[key]]);
      }
    }
    return res;
  };

  // CSV Export
  const downloadCSV = (): void => {
    const rows = flattenForRowExport(data);
    const csvRows = rows.map(r => `"${r[0]}","${r[1] !== undefined ? r[1] : ""}"`);
    csvRows.unshift('"Field","Value"');
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    saveAs(blob, "waterfall.csv");
  };

  // Excel Export
  const downloadExcel = (): void => {
    const rows = flattenForRowExport(data);
    const ws_data = [["Field", "Value"], ...rows];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Waterfall");
    XLSX.writeFile(wb, "waterfall.xlsx");
  };

  return (
    <Layout>
      <h2 className="mb-4">Waterfall Extraction Results</h2>

      {/* Export & Expand/Collapse Buttons */}
      <div className="mb-3">
        <button className="btn btn-sm btn-primary me-2" onClick={downloadCSV}>
          Download CSV
        </button>
        <button className="btn btn-sm btn-success me-2" onClick={downloadExcel}>
          Download Excel
        </button>
        <button className="btn btn-sm btn-info me-2" onClick={() => toggleAll(true)}>
          Expand All
        </button>
        <button className="btn btn-sm btn-warning" onClick={() => toggleAll(false)}>
          Collapse All
        </button>
      </div>

      <div className="table-responsive">
        {/* Waterfall Summary */}
        {data.WaterfallSummary && (
          <>
            <h4>Waterfall Summary</h4>
            <div className="card mb-3 p-3">
              {data.WaterfallSummary}
            </div>
          </>
        )}

        {/* Waterfall Metrics */}
        {data.WaterfallMetrics && (
          <>
            <h4>Waterfall Metrics</h4>
            <table className="table table-bordered mb-4">
              <tbody>
                {Object.entries(data.WaterfallMetrics).map(([key, value]) => (
                  <tr key={key}>
                    <th className="table-dark">{key}</th>
                    <td>{renderValue(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Waterfall Steps */}
        {data.WaterfallSteps && Array.isArray(data.WaterfallSteps) && (
          <>
            <h4>Waterfall Steps</h4>
            {data.WaterfallSteps.map((step, idx) => {
              const stepNumber = step.StepNumber || idx + 1;
              return (
                <div key={idx}>
                  <h5 className="mt-3">Step {stepNumber}</h5>
                  <table className="table table-bordered mb-3">
                    <tbody>
                      {Object.entries(step).map(([key, value]) => {
                        if (key === "StepNumber") return null;
                        return (
                          <tr key={key}>
                            <th className="table-dark">{key}</th>
                            <td>{renderValue(value)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Results;