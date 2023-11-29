// components/common/LoadingSpinner.jsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Use full view height to center vertically in the window
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;
