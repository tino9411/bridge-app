// Inbox.js
import React, { useState, useEffect } from 'react';
import { fetchRequests, fetchMessages, updateRequestStatus } from '../api'; // API functions

const Inbox = () => {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      const fetchedRequests = await fetchRequests();
      const fetchedMessages = await fetchMessages();
      setRequests(fetchedRequests);
      setMessages(fetchedMessages);
    };

    fetchData();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    // Approve or reject request
    await updateRequestStatus(requestId, action);
    // Update state or refetch requests
  };

  return (
    <div>
      {/* List requests */}
      {requests.map(request => (
        <div key={request.id}>
          {/* Display request details */}
          <button onClick={() => handleRequestAction(request.id, 'approve')}>Approve</button>
          <button onClick={() => handleRequestAction(request.id, 'reject')}>Reject</button>
        </div>
      ))}

      {/* List messages */}
      {messages.map(message => (
        <div key={message.id}>
          {/* Display message summary */}
        </div>
      ))}
    </div>
  );
};

export default Inbox;
