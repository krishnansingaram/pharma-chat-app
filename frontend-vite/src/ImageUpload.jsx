import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOcrText('');
      setError(null);
      runOcr(file);
    }
  };

  const runOcr = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const { data: { text } } = await Tesseract.recognize(event.target.result, 'eng');
        setOcrText(text);
      } catch (err) {
        setError('OCR failed. Please try another image.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="input-group">
        <input type="file" className="form-control" id="inputGroupFile02" accept="image/*" onChange={handleImageChange} />
      </div>
      {preview && (
        <div className="preview">
          <h4 className="mt-4 preview-label">Preview:</h4>
          <div className="preview-image-container">
            <img src={preview} alt="Prescription Preview" />
            <button
              className="zoom-icon-btn"
              aria-label="Zoom image"
              onClick={() => setShowModal(true)}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              aria-label="Close preview"
              onClick={() => setShowModal(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <img src={preview} alt="Zoomed Prescription" style={{ maxWidth: '90vw', maxHeight: '80vh' }} />
          </div>
        </div>
      )}
      {loading && <div className="mt-3">Running OCR...</div>}
      {ocrText && (
        <div className="preview-text">
          <h5>Extracted Text:</h5>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{ocrText}</pre>
        </div>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default ImageUpload; 