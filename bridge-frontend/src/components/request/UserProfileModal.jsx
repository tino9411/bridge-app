import React from 'react';
import { Box, Typography, Card, CardHeader, IconButton, Avatar, Chip } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { StyledModal } from "../../utils/modalUtils"; // Assuming you have this utility
import typographyStyles from "../../utils/typographyStyles"; // Assuming you have this utility


const UserProfileModal = ({ user, open, handleClose }) => {
    if (!user) return null;
  
    const renderSkills = (skills) => {
      return skills.map((skill, index) => (
        <Chip key={index} label={skill} variant="outlined" sx={{ margin: 0.5 }} />
      ));
    };
  
    return (
      <StyledModal open={open} onClose={handleClose}>
        <Card sx={{ maxWidth: 600, m: 2 }}>
          <CardHeader
            action={
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            }
            title={
              <Typography variant="h6" sx={typographyStyles.boldTitle}>
                {`${user.firstName} ${user.lastName}`} 
              </Typography>
            }
            subheader={user.email}
          />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 1 }}>
              {user.biography}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {renderSkills(user.skills)}
            </Box>
            <Typography variant="body1">
              <strong>Phone:</strong> {user.phoneNumber || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Secondary Email:</strong> {user.secondaryEmail || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Rating:</strong> {user.rating || 'N/A'}
            </Typography>
          </Box>
        </Card>
      </StyledModal>
    );
  };
  
  export default UserProfileModal;
  
  
