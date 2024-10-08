import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Box,
  Typography,
  IconButton,
  Badge
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RequestIcon from '@mui/icons-material/FormatListBulleted'; // Icon for requests
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification
import { useRequests } from '../contexts/RequestContext'; // Import useRequests

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const { requests, fetchUserRequests } = useRequests(); // Use the RequestContext
  const unreadCount = notifications.filter(n => !n.read).length; // Calculate unread notifications
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length; // Calculate pending requests

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      navigate('/login');
    } else {
      console.error('Logout function not provided');
    }
  };

  useEffect(() => {
    fetchUserRequests(); // Fetch user's join requests
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        {/* Logo and Title */}
        <Avatar sx={{ mr: 1 }}>B</Avatar>
        <Typography variant="h6">Bridge.io</Typography>
      </Box>
      <Divider />
      <List>
        {/* Sidebar Items */}
        <ListItem button component={Link} to="/task-search">
  <ListItemIcon><SearchIcon /></ListItemIcon>
  <ListItemText primary="Task Search" />
</ListItem>
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/projects">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button component={Link} to="/tasks">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
        <ListItem button component={Link} to="/team">
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Team" />
        </ListItem>
        <ListItem button component={Link} to="/join-requests">
          <ListItemIcon>
            <Badge badgeContent={pendingRequestsCount} color="error">
              <RequestIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Join Requests" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <List>
        {/* Logout */}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>

        <ListItem button component={Link} to="/notifications">
          <ListItemIcon>
            <Badge badgeContent={unreadCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>

      </List>
    </Drawer>
  );
};

export default Sidebar;
