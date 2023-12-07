import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Tooltip, Box, Stack, Collapse } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

const NotificationCard = ({ notification, markAsRead, deleteNotification }) => {
  const [show, setShow] = useState(true); // To control the visibility of the card
  const cardBackground = notification.read ? '#fff' : 'linear-gradient(135deg, #e6e8f7 0%, #f7f8fa 100%)';

  // Handle delete with animation
  const handleDelete = (id) => {
    setShow(false); // Hide the card first
    setTimeout(() => deleteNotification(id), 300); // Then delete after the animation
  };

  return (
    <Collapse in={show} timeout={300}>
      <Card 
        variant="outlined" 
        sx={{ 
          m: 2,
          maxWidth: 700, 
          background: cardBackground,
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.12)',
          borderRadius: '12px',
          border: 'none',
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <NotificationsIcon color="primary" sx={{ mr: 2, fontSize: '1.2rem' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                {moment(notification.createdAt).fromNow()}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            {!notification.read && (
              <Tooltip title="Mark as read">
                <IconButton size="small" onClick={() => markAsRead(notification._id)}>
                  <CheckCircleIcon color="success" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete notification">
              <IconButton size="small" onClick={() => handleDelete(notification._id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>
    </Collapse>
  );
};

export default NotificationCard;
