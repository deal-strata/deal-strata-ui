import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { agreementApi } from '../../services/clientConfig';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const UploadAgreement: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      return;
    }
    if (f.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum 20 MB allowed.');
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(null);
    if (!file) {
      setError('Please select a PDF to upload.');
      return;
    }
    setUploading(true);
    try {
      // agreementApi.createAgreement expects a single object: { file, title?, description?, dealId?, metadata? }
      const resp: any = await agreementApi.createAgreement({
        file,
        title: title || undefined,
        description: description || undefined,
      });
      const data = resp?.data || resp;
      // Try to find an id/documentId in the response
      const documentId = data?.documentId || data?.id || data?.agreementId || data?.agreement?.id;
      setSuccess('File uploaded successfully. Processing has started.');
      if (documentId) {
        // Navigate to the agreement details page for the uploaded document
        navigate(`/agreements/${documentId}`);
      } else {
        // If no id returned, fall back to the agreements list after short delay
        setTimeout(() => navigate('/agreements'), 1200);
      }
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || err?.message || 'Upload failed';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="card mx-auto" style={{ maxWidth: 800 }}>
        <div className="card-body">
          <h3 className="card-title" style={{ fontFamily: 'Playfair Display, serif', color: '#46BDC6' }}>Upload Agreement (PDF)</h3>
          <p className="text-muted">Select a PDF file to upload. The system will process the document after upload.</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-3">
            <label className="form-label">Title (optional)</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Agreement title" />
          </div>

          <div className="mb-3">
            <label className="form-label">Description (optional)</label>
            <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Short description" />
          </div>

          <div className="mb-3">
            <label className="form-label">PDF File</label>
            <input type="file" accept="application/pdf" className="form-control" onChange={onFileChange} />
            {file && (
              <div className="mt-2 small text-muted">
                Selected: {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button className="btn" style={{ backgroundColor: '#46BDC6', color: '#fff', border: 'none' }} onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden></span>
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/agreements')} disabled={uploading}>Cancel</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadAgreement;
