import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Collapse, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { styled } from '@mui/material/styles';

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
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ 
        mb: 2, 
        boxShadow: 3, 
        borderRadius: 2, 
        maxWidth: isLargeScreen ? '60%' : '100%', margin: 'auto' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>{`Task: ${request.task.title}`}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {`Requested by: ${request.user.username} on ${new Date(request.createdAt).toLocaleDateString()}`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {`Message: ${request.message}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={() => {/* Handle approve action */}}
          disabled={request.status !== 'pending'}
          sx={{ marginRight: 1 }}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<HighlightOffIcon />}
          onClick={() => {/* Handle reject action */}}
          disabled={request.status !== 'pending'}
        >
          Reject
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box sx={{ pt: 1 }}>
            <Typography paragraph variant="body2">{`Task Description: ${request.task.description}`}</Typography>
            <Typography paragraph variant="body2">{`Request Status: ${request.status}`}</Typography>
            {/* Additional details as needed */}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default RequestListItem;
