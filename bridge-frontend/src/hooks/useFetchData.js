import { useState, useEffect } from "react";
import axios from "axios";

const useFetchData = (url, token, dependencies = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, dependencies);

  return { data, error };
};

export default useFetchData;
