import React, { useState } from 'react';
import { Card, CardContent, Button, Typography, IconButton, Collapse, Box, Grid, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { styled } from '@mui/material/styles';
import { useRequests } from '../../contexts/RequestContext';
import UserProfileModal from './UserProfileModal'; // Import the modal component



const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const RequestListItem = ({ request }) => {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State to control the modal
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { updateRequestStatus } = useRequests(); // using the context hook

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleApprove = () => {
    updateRequestStatus(request._id, 'approved');
  };

  const handleReject = () => {
    updateRequestStatus(request._id, 'rejected');
  };

  const handleUserClick = () => {
    setModalOpen(true); // Open the modal when user clicks on username
  };

  const handleModalClose = () => {
    setModalOpen(false); // Close the modal
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 3, borderRadius: 2, maxWidth: isLargeScreen ? '40%' : '100%', margin: 'auto' }}>
      <Grid container alignItems="center">
        <Grid item xs>
        <CardContent >
            <Typography variant="subtitle1" gutterBottom>{`Task: ${request.task.title}`}</Typography>
            <Typography variant="body2" color="textSecondary">
              Requested by: 
              <Button
                onClick={handleUserClick}
                sx={{ textTransform: 'none', padding: 0, minWidth: 'auto', marginLeft: 1 }}
              >
                {request.user.username}
              </Button>
            {" "} on {new Date(request.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {`Message: ${request.message}`}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item>
          <Tooltip title="Approve">
          <IconButton
            color="success"
            onClick={handleApprove}
            disabled={request.status !== 'pending'}
          >
              <CheckCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
          <IconButton
            color="error"
            onClick={handleReject}
            disabled={request.status !== 'pending'}
          >
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box>
            <Typography paragraph variant="body2">{`Task Description: ${request.task.description}`}</Typography>
            <Typography paragraph variant="body2">{`Request Status: ${request.status}`}</Typography>
          </Box>
        </CardContent>
      </Collapse>
      <Box sx={{ position: 'relative' }}>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <UserProfileModal
        user={request.user}
        open={modalOpen}
        handleClose={handleModalClose}
      />
    </Card>
  );
};

export default RequestListItem;
