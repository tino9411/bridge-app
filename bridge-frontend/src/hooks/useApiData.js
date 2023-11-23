// hooks/useApiData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApiData(url, token, dependency = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Error fetching data');
      }
    };

    if (token) {
      fetchData();
    }
  }, [url, token, ...dependency]);

  return [data, setData, error]; // return setData as well
}