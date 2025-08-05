import React, { useState } from 'react';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Upload Prescription Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <div>
          <h3>Preview:</h3>
          <img src={preview} alt="Prescription Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUpload; 