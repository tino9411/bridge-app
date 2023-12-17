import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // Assuming you have an AuthContext
import useSnackbar from '../hooks/useSnackbar'; // Import the useSnackbar hook

const RequestContext = createContext();

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const { showSnackbar } = useSnackbar();


  // Function to create a join request
  const createJoinRequest = async (taskId, message) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/requests`,
        { taskId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests([...requests, response.data]);
      showSnackbar('Join request sent successfully', 'success');
    } catch (error) {
      console.error('Error sending join request', error);
      showSnackbar('Error sending join request', 'error');
    }
  };

  // Function to fetch join requests for a user
  const fetchUserRequests = async () => {
    // Check if user and token are available
      try {
        const response = await axios.get(
          `http://localhost:3000/requests/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching join requests', error);
        showSnackbar('Error fetching join requests', 'error');
      }
  };

  useEffect(() => {
    if (user && token) {
      fetchUserRequests();
    }
  }, [user, token]); // Add user and token as dependencies
  
  
  // Function to update the status of a join request
  const updateRequestStatus = async (requestId, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/requests/${requestId}/status`,
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state if necessary
      showSnackbar('Request status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating request status', error);
      showSnackbar('Error updating request status', 'error');
    }
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        createJoinRequest,
        fetchUserRequests,
        updateRequestStatus,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
