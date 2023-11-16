// FileList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const { taskId } = useParams();

  useEffect(() => {
    // Fetch files
  }, [taskId]);

  return (
    <div>
      <h2>Task Files</h2>
      {error && <p>{error}</p>}
      {/* List files here */}
    </div>
  );
};

export default FileList;
