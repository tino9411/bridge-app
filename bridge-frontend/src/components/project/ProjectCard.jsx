import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { green, orange, red, blue, grey } from "@mui/material/colors";
import { formatDistance } from "date-fns";

const ProjectCard = ({ project, onDelete, openEditModal }) => {
  const navigate = useNavigate();

  // Function to get a human-readable string representing the time since last update
  const timeSinceLastUpdate = (updatedAt) => {
    return formatDistance(new Date(updatedAt), new Date(), { addSuffix: true });
  };

  // Define a theme object or use ThemeProvider to globally define these
  const theme = {
    status: {
      planning: blue[500],
      "in progress": orange[500],
      completed: green[500],
      "on hold": red[500],
    },
    priority: {
      low: green[700],
      medium: orange[700],
      high: red[700],
      new: grey[700],
    },

    title: {
      fontSize: 12,
    },
  };

  // Format date function here

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleEditClick = (event) => {
    event.stopPropagation(); // Prevent card click event
    openEditModal(project); // openEditModal should be passed as a prop from Dashboard
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    // Delete logic here
    try {
      onDelete(project._id);
    } catch (error) {
      console.error("Error deleting the project:", error);
    }
  };

  const goToProjectDetails = () => {
    navigate(`/projects/${project._id}`);
  };

  return (
    <Card
      sx={{
        flexGrow: 1, // Take up all the available space
        boxShadow: 3,
        "&:hover": { transform: "translateY(-10px)", boxShadow: 8 },
        borderRadius: 5,
        borderColor: grey[300],
        m: 1, // Margin to ensure space around the card
        display: "flex",
        flexDirection: "column", // Stack children vertically
        justifyContent: "space-between", // Distribute space around items
      }}
      onClick={goToProjectDetails}
    >
      <CardHeader
        action={
          <>
            <Grid container spacing={1}>
              <Tooltip title="Edit Project">
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={handleEditClick}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={handleDelete}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </>
        }
        title={project.name}
        subheader={`${formatDate(project.startDate)} - ${formatDate(
          project.endDate
        )}`}
        titleTypographyProps={{
          fontWeight: "fontWeightLight",
          fontSize: "0.8rem",
        }}
        subheaderTypographyProps={{
          fontSize: "0.7rem",
          justifyContent: "center",
          alignContent: "center",
        }}
      />
      <CardContent>
      <Box>
      <Typography
          variant="body3"
          color="text.secondary"
          sx={{
            fontSize: "0.7rem",
            justifyContent: "center",
            alignContent: "center",
            m: 0,
            padding: 0,
          }}
        >
        <Typography variant="body3" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <span>Tasks:</span>
  <Chip label={project.taskCount} size="small" sx={{ height: '20px', fontSize: "0.6rem" }} />
</Typography>
          <Typography variant="body3" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <span>Team Members:</span>
  <Chip label={project.teamMemberCount} size="small" sx={{ height: '20px', fontSize: "0.6rem", }} />
</Typography>
          Budget: ${project.budget}
        </Typography>
      </Box>
        
        <Chip
          label={project.status}
          size="small"
          sx={{
            bgcolor: theme.status[project.status],
            color: "common.white",
            m: 0.1,
            fontSize: "0.6rem",
          }}
        />
        <Chip
          label={project.priority}
          size="small"
          sx={{
            bgcolor: theme.priority[project.priority],
            color: "common.white",
            m: 0.1,
            fontSize: "0.6rem",
          }}
        />
      </CardContent>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          bgcolor: grey[200],
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ fontSize: "0.7rem" }}
        >
          Last updated {timeSinceLastUpdate(project.updatedAt)}
        </Typography>
      </Box>
    </Card>
  );
};

export default ProjectCard;
