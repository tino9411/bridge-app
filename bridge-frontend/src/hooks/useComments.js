// useComments.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useComments = (taskId, token) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      setLoading(true);
      axios.get(`http://localhost:3000/tasks/${taskId}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          setComments(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [taskId, token]);

  return [comments, setComments, loading];
};

export default useComments;
