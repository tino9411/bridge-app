import React, { useState, useEffect } from "react";
import { useRequests } from "../../contexts/RequestContext";
import {

  Box,
  Typography,
  Pagination,
  Snackbar,
} from "@mui/material";
import RequestListItem from "./RequestListItem";
import { paginate, applyFilters } from "../../utils/pagination";
import Alert from "@mui/material/Alert";
import LoadingSpinner from "../common/LoadingSpinner"; // Importing the LoadingSpinner

const JoinRequests = () => {
  const {
    requests,
    fetchUserRequests,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  } = useRequests();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters] = useState({});
  const itemsPerPage = 10; // Number of items per page
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserRequests();
      } catch (err) {
        setError("Error fetching join requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredRequests = applyFilters(requests, filters);
  const paginatedRequests = paginate(
    filteredRequests,
    currentPage,
    itemsPerPage
  );

  if (loading) return <LoadingSpinner />; // Using the LoadingSpinner heres
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Box sx={{ margin: 2, padding: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Join Requests
      </Typography>
      <Box
        sx={{
          maxHeight: "calc(100vh - 200px)", // Adjust 200px based on your header/footer sizes
          overflowY: "auto",
          marginBottom: 2,
        }}
      >
        {paginatedRequests.map((request, index) => (
          <Box
            key={request._id}
            sx={{
              marginBottom: index === paginatedRequests.length - 1 ? 2 : 2,
              marginTop: index === 0 ? 2 : 0,
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            <RequestListItem request={request} />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(filteredRequests.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Positioning Snackbar
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JoinRequests;
