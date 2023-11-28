import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Checkbox,
  FormControlLabel,
  CardContent,
  IconButton,
  CardHeader,
  Skeleton,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { StyledModal } from "../../utils/modalUtils";
import { useTheme } from "@mui/material/styles";
import { formatDate } from "../../utils/dateUtils"; // Assuming you have this utility
import { StyledCard } from "../../utils/cardUtils";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import PhaseContext from "./PhaseContext"; // Adjust the import path as needed


const TaskAssignModal = ({ open, onClose, onTaskAssigned, phaseId }) => {
  const {
    projectId,
    showSnackbar,
    refreshPhaseList // Assuming you want to use refreshPhaseList from context
  } = useContext(PhaseContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [phase, setPhase] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(""); // State for task filter
  const theme = useTheme();

  // Fetch phase details and tasks
  useEffect(() => {
    const fetchPhaseDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/projects/${projectId}/phases/${phaseId}`
        );
        setPhase(response.data.phase);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching phase details", error);
        setIsLoading(false);
      }
    };

    fetchPhaseDetails();
  }, [phaseId, projectId]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!phase) return;

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/projects/${projectId}/tasks`
        );
        // Filter tasks to include only those within the phase date range
        const filteredTasks = response.data.filter(
          (task) =>
            new Date(task.dueDate) >= new Date(phase.startDate) &&
            new Date(task.dueDate) <= new Date(phase.endDate)
        );
        setTasks(filteredTasks);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching tasks", err);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [phase, projectId]);

  // Handle task selection for assignment or unassignment
  const handleTaskSelect = (taskId) => {
    const updatedSelectedTasks = selectedTasks.includes(taskId)
      ? selectedTasks.filter((id) => id !== taskId)
      : [...selectedTasks, taskId];
    setSelectedTasks(updatedSelectedTasks);
  };

  // Handle task assignment or unassignment
  const handleTaskAction = async (action) => {
    try {
      setIsLoading(true);
      for (const taskId of selectedTasks) {
        const url = `http://localhost:3000/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`;
        if (action === "assign") {
          await axios.post(url);
        } else if (action === "unassign") {
          await axios.delete(url);
        }
      }
      onTaskAssigned(); // Trigger update in parent component
      onClose(); // Close modal
      showSnackbar(`Tasks successfully ${action === 'assign' ? 'assigned' : 'unassigned'}`, 'success');
      refreshPhaseList(); // Call this function after task actions
    } catch (err) {
      console.error(`Error ${action} tasks:`, err);
      showSnackbar(`Error ${action} tasks`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleSelectAll to reflect the current filter
  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(t => t._id));
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const isAssigned = phase.assignedTasks.includes(task._id);
      if (filter === "assigned") return isAssigned;
      if (filter === "unassigned") return !isAssigned;
      return true; // Default to 'all'
    });
  };

  const filteredTasks = getFilteredTasks(); // Use this variable to render the task list

  const calculateTotalRate = () => {
    // Calculate the total rate for selected and already assigned tasks
    const selectedTaskIds = new Set(selectedTasks);
    const totalRate = tasks.reduce((total, task) => {
      if (
        selectedTaskIds.has(task._id) ||
        phase.assignedTasks.includes(task._id)
      ) {
        return total + task.rate;
      }
      return total;
    }, 0);
    return totalRate;
  };

  const renderPhaseDetails = () => {
    const totalRate = calculateTotalRate();
    const assignedTasksCount =
      phase?.assignedTasks.length + selectedTasks.length;
    return (
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body2">
            Start Date:{" "}
            {phase?.startDate
              ? new Date(phase.startDate).toLocaleDateString()
              : "N/A"}
          </Typography>
          <Typography variant="body2">
            End Date:{" "}
            {phase?.endDate
              ? new Date(phase.endDate).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Box>
        <Chip
          label={`Current Milestones: ${phase?.milestones.length || 0}`}
          size="small"
          sx={{ mr: 1 }}
        />
        <Chip
          label={`${assignedTasksCount} Task${
            assignedTasksCount !== 1 ? "s" : ""
          } Assigned`}
          size="small"
          sx={{ mr: 1 }}
        />
        <Chip
          label={`Total Cost: $${totalRate.toFixed(2)}`}
          size="small"
          sx={{ mr: 1 }}
        />
        <Divider />
      </Box>
    );
  };

  const renderTaskItem = (task) => {
    const isAssigned = phase.assignedTasks.includes(task._id);
    const assignedTaskStyle = isAssigned ? { backgroundColor: "#f0f0f0" } : {};
    return (
      <React.Fragment>
        <ListItem key={task._id} dense sx={assignedTaskStyle}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTasks.includes(task._id)}
                onChange={() => handleTaskSelect(task._id)}
              />
            }
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "300%",
                  maxWidth: 400,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    overflowY: "auto",
                  }}
                >
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.status[task.status],
                            color: "common.white",
                            m: 0.1,
                            fontSize: "0.6rem",
                          }}
                        />{" "}
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.priority[task.priority],
                            color: "common.white",
                            m: 0.1,
                            fontSize: "0.6rem",
                          }}
                        />
                      </>
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: "fontWeightLight",
                    }}
                  >
                    {formatDate(task.dueDate)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Rate: ${task.rate}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
        <Divider variant="middle" sx={{ bgcolor: "grey.800" }} />
      </React.Fragment>
    );
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <StyledCard
        sx={{
          width: 500,
          borderRadius: 5,
        }}
      >
        <CardHeader
          title={`Manage Tasks for Phase: ${phase?.name}`}
          titleTypographyProps={{ variant: "h5", align: "center" }}
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          {isLoading ? (
            <Skeleton variant="rectangular" width={400} height={200} />
          ) : (
            <Box>
              {renderPhaseDetails()}
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(event, newFilter) => setFilter(newFilter)}
                aria-label="Task filter"
              >
                <ToggleButton value="all" aria-label="all tasks">
                  All
                </ToggleButton>
                <ToggleButton value="assigned" aria-label="assigned tasks">
                  Assigned
                </ToggleButton>
                <ToggleButton value="unassigned" aria-label="unassigned tasks">
                  Unassigned
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                startIcon={<SelectAllIcon />}
                onClick={() =>
                  handleSelectAll(selectedTasks.length !== filteredTasks.length)
                }
                sx={{ my: 1 }}
              >
                Select All
              </Button>
              {filteredTasks.length > 0 ? (
                <List
                  sx={{
                    overflowY: "auto",
                  }}
                >
                  {filteredTasks.map(renderTaskItem)}
                </List>
              ) : (
                <Typography sx={{ textAlign: "center", my: 2 }}>
                  No tasks available for assignment in this phase's date range.
                </Typography>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleTaskAction("unassign")}
                  disabled={isLoading}
                >
                  Unassign Selected
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleTaskAction("assign")}
                  disabled={isLoading}
                >
                  Assign Selected
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </StyledModal>
  );
};

export default TaskAssignModal;
