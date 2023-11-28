// useFetchData.js
import { useState, useEffect } from "react";
import axios from "axios";

const useFetchData = (url, token = '', dependencies = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, { headers });
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [url, ...dependencies]); // Include url in dependencies array

  return { data, error };
};

export default useFetchData;
