// FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { taskId } = useParams();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Upload file
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default FileUpload;
