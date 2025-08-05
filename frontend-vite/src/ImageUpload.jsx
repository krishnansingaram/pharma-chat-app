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
      <div className="input-group">
        <input type="file" className="form-control" id="inputGroupFile02" accept="image/*" onChange={handleImageChange} />
      </div>
      {preview && (
        <div className="preview">
          <h4 className="mt-4">Preview:</h4>
          <img src={preview} alt="Prescription Preview" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload; 