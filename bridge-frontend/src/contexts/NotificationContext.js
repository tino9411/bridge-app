import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // You might use axios or another HTTP client
import { useAuth } from '../hooks/useAuth';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { token, user } = useAuth(); // Use your authentication token
  const socket = useSocket();
  const baseUrl = 'http://localhost:3000'
  

  // Function to fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${baseUrl}/notifications/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (user && user._id && token) {
      fetchNotifications();
      
      // Join the room for real-time notifications
      socket.emit('joinRoom', user._id);

      // Define the notification handler
      const handleNotification = (notification) => {
        setNotifications(prev => [...prev, notification]);
      };

      // Register the notification listener
      socket.on('notification', handleNotification);

      // Cleanup function
      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [user, token, socket]); // Dependencies
  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${baseUrl}/notifications/markAsRead/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Function to delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${baseUrl}/notifications/delete/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Function to get count of unread notifications
    const getUnreadCount = async (userId) => {
        try {
        const response = await axios.get(`${baseUrl}/notifications/unreadCount/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
        } catch (error) {
        console.error('Error getting unread notification count:', error);
        }
    };

  return (
    <NotificationContext.Provider value={{ 
        notifications, 
        markAsRead, 
        deleteNotification,
        getUnreadCount
         }}>
      {children}
    </NotificationContext.Provider>
  );
}
