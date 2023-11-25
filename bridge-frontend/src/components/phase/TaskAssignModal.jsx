import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
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

const TaskAssignModal = ({
  open,
  onClose,
  projectId,
  phaseId,
  onTaskAssigned,
}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [phase, setPhase] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchPhaseDetails = async () => {
      try {
        setIsLoading(true);
        const phaseResponse = await axios.get(
          `http://localhost:3000/projects/${projectId}/phases/${phaseId}`
        );
        setPhase(phaseResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching phase details", error);
        setIsLoading(false);
      }
    };

    fetchPhaseDetails();
  }, [phaseId, projectId]);

  useEffect(() => {
    const fetchAvailableTasks = async () => {
      if (!phase) return;

      try {
        setIsLoading(true);
        const tasksResponse = await axios.get(
          `http://localhost:3000/projects/${projectId}/tasks`
        );
        const filteredTasks = tasksResponse.data.filter(
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

    if (phase) {
      fetchAvailableTasks();
    }
  }, [phase, projectId]);
  const handleTaskSelect = (taskId) => {
    const currentIndex = selectedTasks.indexOf(taskId);
    const newSelectedTasks = [...selectedTasks];

    if (currentIndex === -1) {
      newSelectedTasks.push(taskId);
    } else {
      newSelectedTasks.splice(currentIndex, 1);
    }

    setSelectedTasks(newSelectedTasks);
  };

  const assignTasks = async () => {
    if (selectedTasks.length === 0) {
      console.error("No tasks selected");
      return;
    }

    try {
      for (const taskId of selectedTasks) {
        await axios.post(
          `http://localhost:3000/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`
        );
      }
      onClose();
      onTaskAssigned();
    } catch (err) {
      console.error("Error assigning tasks", err);
    }
  };

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
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", mb: 1}}>
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
          label={`Total Rate: $${totalRate.toFixed(2)}`}
          size="small"
          sx={{ mr: 1 }}
        />
        <Divider />
      </Box>
    );
  };
  
  const renderTaskItem = (task) => {
    return (
      <React.Fragment>
        <ListItem key={task._id} dense>
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
                  overflowY: "auto",

                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", }}>
                  <ListItemText primary={task.title}   
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
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
         }}>
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
          title={phase?.name}
          titleTypographyProps={{ variant: "h5", align: "center" }}
        />
        <CardContent>
          {isLoading ? (
            <Skeleton variant="rectangular" width={400} height={200} />
          ) : (
            <Box>
              {renderPhaseDetails()}
              {tasks.length > 0 ? (
                <List>{tasks.map(renderTaskItem)}</List>
              ) : (
                <Typography sx={{ textAlign: "center", my: 2 }}>
                  No tasks available for assignment in this phase's date range.
                </Typography>
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={assignTasks}
                  disabled={isLoading}
                >
                  Assign Tasks
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
