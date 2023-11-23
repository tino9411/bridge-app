// useComments.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useComments = (taskId, token) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (taskId) {
      axios.get(`http://localhost:3000/tasks/${taskId}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setComments(response.data))
        .catch(error => console.error(error));
    }
  }, [taskId, token]);

  return [comments, setComments];
};

export default useComments;
