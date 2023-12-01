import React from "react";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TeamMembers = ({ team, projects, onProjectSelect }) => {
  // Function to handle project selection change
  const handleProjectChange = (event) => {
    onProjectSelect(event.target.value);
  };

  return (
    <Card
      sx={{
        height: "100%",
        maxHeight: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: 5,
        overflowY: "auto",
      }}
    >
      <CardHeader
        title="Team Members"
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        titleTypographyProps={{ variant: "h6", align: "center" }}
      />

      {/* Project Selection Dropdown */}
      <Box sx={{ p: 2 }}>
        <Select
          onChange={handleProjectChange}
          fullWidth
          displayEmpty
          defaultValue=""
        >
          <MenuItem value="" disabled>
            Select a Project
          </MenuItem>
          {projects &&
            projects.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.name}
              </MenuItem>
            ))}
        </Select>
      </Box>

      <Divider />
      <List dense>
        {team &&
          team.map((member) => (
            <React.Fragment key={member.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // or any other color you prefer
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={member.name}
                    src={
                      member.profileImage || "/static/images/avatar/default.jpg"
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {member.username}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="middle" sx={{ bgcolor: "grey.800" }} />
            </React.Fragment>
          ))}
      </List>
    </Card>
  );
};

export default TeamMembers;
