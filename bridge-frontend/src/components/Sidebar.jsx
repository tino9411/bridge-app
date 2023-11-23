import React from 'react';
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
  IconButton
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      navigate('/login');
    } else {
      console.error('Logout function not provided');
    }
  };

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
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <List>
        {/* Logout */}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
