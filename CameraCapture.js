import React, { useRef, useState } from 'react';

function CameraCapture() {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/png'));
  };

  return (
    <div>
      <h2>Capture Prescription Image</h2>
      <button onClick={startCamera}>Start Camera</button>
      <div>
        <video ref={videoRef} autoPlay style={{ width: '300px', marginTop: '10px' }} />
      </div>
      <button onClick={captureImage}>Capture</button>
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured Prescription" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}

export default CameraCapture; 