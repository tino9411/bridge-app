import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // Assuming you have an AuthContext
import useSnackbar from '../hooks/useSnackbar'; // Import the useSnackbar hook

const MessageContext = createContext();

export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const { showSnackbar } = useSnackbar();

  // Function to send a new message
  const sendMessage = async (receiverId, content) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/messages`,
        { receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, response.data]);
      showSnackbar('Message sent successfully', 'success');
    } catch (error) {
      console.error('Error sending message', error);
      showSnackbar('Error sending message', 'error');
    }
  };

  // Function to fetch messages between two users
  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/messages/${otherUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages', error);
      showSnackbar('Error fetching messages', 'error');
    }
  };

  // Function to mark a message as read
  const markMessageRead = async (messageId) => {
    try {
      await axios.patch(
        `http://localhost:3000/messages/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state if necessary
      showSnackbar('Message marked as read', 'success');
    } catch (error) {
      console.error('Error marking message as read', error);
      showSnackbar('Error marking message as read', 'error');
    }
  };

  // Function to delete a message
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(
        `http://localhost:3000/messages/${messageId}/delete`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(messages.filter((message) => message._id !== messageId));
      showSnackbar('Message deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting message', error);
      showSnackbar('Error deleting message', 'error');
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
        fetchMessages,
        markMessageRead,
        deleteMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
