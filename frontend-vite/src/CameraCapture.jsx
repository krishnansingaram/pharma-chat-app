import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

function CameraCapture() {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const enableStream = async () => {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setError("Could not access the camera. Please check permissions and try again.");
          setIsCameraOn(false);
        }
      }
    };

    enableStream();

    return () => {
      // Cleanup: stop all tracks of the stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setError(null);
    if (!isCameraOn) {
      setCapturedImage(null);
    }
    setIsCameraOn(prevIsOn => !prevIsOn);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setOcrText('');
      setError(null);
      runOcr(dataUrl);
      toggleCamera();
    }
  };

  const runOcr = (dataUrl) => {
    setLoading(true);
    Tesseract.recognize(dataUrl, 'eng')
      .then(({ data: { text } }) => {
        setOcrText(text);
      })
      .catch(() => {
        setError('OCR failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="text-center">
      <button className={`btn ${isCameraOn ? 'btn-danger' : 'btn-primary'} mb-3`} onClick={toggleCamera}>
        {isCameraOn ? 'Stop Camera' : 'Start Camera'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {isCameraOn && (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
          <button className="btn btn-success mt-3" onClick={captureImage}>Capture</button>
        </div>
      )}
      {capturedImage && (
        <div className="captured-image">
          <h4 className="mt-4">Captured Image:</h4>
          <img src={capturedImage} alt="Captured Prescription" />
          <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => setShowModal(true)}>Zoom</button>
        </div>
      )}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
            <img src={capturedImage} alt="Zoomed Prescription" style={{ maxWidth: '90vw', maxHeight: '80vh' }} />
            <button className="btn btn-secondary mt-3" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      {loading && <div className="mt-3">Running OCR...</div>}
      {ocrText && (
        <div className="mt-3">
          <h5>Extracted Text:</h5>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{ocrText}</pre>
        </div>
      )}
    </div>
  );
}

export default CameraCapture; 