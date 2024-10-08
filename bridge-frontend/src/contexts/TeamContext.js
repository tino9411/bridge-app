// contexts/TeamContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const TeamContext = createContext();

export const useTeam = () => useContext(TeamContext);

export const TeamProvider = ({ children }) => {
  const { token } = useAuth();
  const [team, setTeam] = useState([]);


  const fetchTeam = async (projectId) => {
    if (token && projectId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/projects/${projectId}/team`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeam(response.data);
      } catch (error) {
        console.error("Error fetching team data", error);
        // Optionally handle error
      }
    }
  };

  return (
    <TeamContext.Provider value={{ team, fetchTeam }}>
      {children}
    </TeamContext.Provider>
  );
};
