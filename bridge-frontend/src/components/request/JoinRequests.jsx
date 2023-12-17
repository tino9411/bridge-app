import React, { useState, useEffect } from 'react';
import { useRequests } from '../../contexts/RequestContext';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Collapse,
} from '@mui/material';

const JoinRequests = () => {
  const { requests, fetchUserRequests, updateRequestStatus } = useRequests();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null); // For expandable list items

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserRequests();
      } catch (err) {
        setError('Error fetching join requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ margin: 2, padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Join Requests
      </Typography>
      {requests.map((request) => (
        <Card key={request._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">{`Request for Task: ${request.task.title}`}</Typography>
            <Typography variant="body2" color="textSecondary">
              {`Requested by: ${request.user.username} on ${new Date(request.createdAt).toLocaleDateString()}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => updateRequestStatus(request._id, 'approved')}
              disabled={request.status !== 'pending'}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => updateRequestStatus(request._id, 'rejected')}
              disabled={request.status !== 'pending'}
            >
              Reject
            </Button>
            <Button size="small" onClick={() => handleExpandClick(request._id)}>
              {expandedId === request._id ? 'Hide Details' : 'Show Details'}
            </Button>
          </CardActions>
          <Collapse in={expandedId === request._id} timeout="auto" unmountOnExit>
            <CardContent>
              {/* Add more detailed information here */}
              <Typography paragraph>{`Message: ${request.message}`}</Typography>
              {/* Add more details as needed */}
            </CardContent>
          </Collapse>
        </Card>
      ))}
      {requests.length === 0 && <Typography>No join requests available.</Typography>}
    </Box>
  );
};

export default JoinRequests;
