import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { Box, Typography } from '@mui/material';
import NotificationCard from './NotificationCard'; // Assuming the file is in the same directory

const Notification = () => {
  const { notifications, markAsRead, deleteNotification } = useNotification();

  if (notifications.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="h6">No notifications</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} 
    sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '1000px',
        margin: 'auto',
        
    }}
    >
    <Box sx={{ mb: 2, width: 800, overflowY: 'auto', maxHeight: 900 }}>
      {notifications.map(notification => (
        <NotificationCard
          key={notification._id}
          notification={notification}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
        />
      ))}
      </Box>
    </Box>
  );
};

export default Notification;
