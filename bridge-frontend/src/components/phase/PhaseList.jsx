// PhaseList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PhaseList = () => {
  const [phases, setPhases] = useState([]);
  const [error, setError] = useState('');
  const { projectId } = useParams();

  useEffect(() => {
    // Fetch phases
  }, [projectId]);

  return (
    <div>
      <h2>Project Phases</h2>
      {error && <p>{error}</p>}
      {/* List phases here */}
      {/* Link or button to add a new phase */}
    </div>
  );
};

export default PhaseList;
