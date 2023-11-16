// MilestoneList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MilestoneList = () => {
  const [milestones, setMilestones] = useState([]);
  const [error, setError] = useState('');
  const { phaseId } = useParams();

  useEffect(() => {
    // Fetch milestones
  }, [phaseId]);

  return (
    <div>
      <h2>Phase Milestones</h2>
      {error && <p>{error}</p>}
      {/* List milestones here */}
      {/* Button to add new milestone */}
    </div>
  );
};

export default MilestoneList;
