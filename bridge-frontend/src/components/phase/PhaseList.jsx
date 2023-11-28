// PhaseList.js
import React, { useState } from "react";
import axios from "axios";
import { handleApiError } from "../../utils/handleApiError";
import { StyledCard } from "../../utils/cardUtils";
import {
  CardHeader,
  CardContent,
  List,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreatePhaseModal from "./CreatePhaseModal";
import TaskAssignModal from "./TaskAssignModal";
import PhaseListItem from "./PhaseListItem";
import useFetchData from "../../hooks/useFetchData"; // Import the useFetchData hook
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import useSnackbar from "../../hooks/useSnackbar";
import PhaseContext from "./PhaseContext";
import EditPhaseModal from "./EditPhaseModal";

const PhaseList = ({ projectId }) => {
  const phasesUrl = `http://localhost:3000/projects/${projectId}/phases`;
  const [fetchTrigger, setFetchTrigger] = useState(false); // New state for triggering re-fetch
  const { data: response, error: phasesError } = useFetchData(phasesUrl, "", [
    projectId,
    fetchTrigger,
  ]); // Add fetchTrigger to dependencies
  const phasesData = response?.phases || [];

  const [expanded, setExpanded] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [phaseToEdit, setPhaseToEdit] = useState(null);
  const [showTaskAssignModal, setShowTaskAssignModal] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);

  const [newPhase, setNewPhase] = useState({
    name: "",
    startDate: "",
    endDate: "",
    assignedTasks: [],
  });

  // State for managing dialog visibility and phase ID
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState(null);
  const [hasAssignedTasks, setHasAssignedTasks] = useState(false);
  // Function to refresh phase list
  const refreshPhaseList = () => setFetchTrigger(!fetchTrigger);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  } = useSnackbar();

  // Function to handle phase creation
  const handleCreatePhaseSubmit = async (newPhaseData) => {
    try {
      await axios.post(phasesUrl, newPhaseData);
      showSnackbar("Phase created successfully", "success");
      setFetchTrigger(!fetchTrigger); // Toggle fetchTrigger to re-fetch phases
    } catch (err) {
      console.error("Error creating phase", handleApiError(err));
      showSnackbar("Error creating phase", "error");
    }
  };

  // Function to handle the expansion of a phase item
  const handleExpandClick = (phaseId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [phaseId]: !prevExpanded[phaseId],
    }));
  };

  // Function to open the task assignment modal
  const openTaskAssignModal = (phaseId) => {
    setSelectedPhaseId(phaseId);
    setShowTaskAssignModal(true);
  };

  // Function to open edit modal
  const openEditPhaseDialog = (phase) => {
    setPhaseToEdit(phase);
    setShowEditModal(true);
  };

  const openDeletePhaseDialog = (phaseId, hasTasks) => {
    setPhaseToDelete(phaseId);
    setHasAssignedTasks(hasTasks);
    setOpenDeleteDialog(true);
  };

  // Function to handle phase update
  const handleUpdatePhaseSubmit = async (updatedPhaseData) => {
    try {
      await axios.put(`${phasesUrl}/${updatedPhaseData._id}`, updatedPhaseData);
      showSnackbar("Phase updated successfully", "success");
      setFetchTrigger(!fetchTrigger); // Trigger re-fetch
      setShowEditModal(false); // Close edit modal
    } catch (err) {
      console.error("Error updating phase", handleApiError(err));
      showSnackbar("Error updating phase", "error");
    }
  };
  // Function to handle phase deletion
  const deletePhase = async () => {
    try {
      const url = hasAssignedTasks
        ? `${phasesUrl}/${phaseToDelete}?deleteTasks=true`
        : `${phasesUrl}/${phaseToDelete}`;
      const response = await axios.delete(url);
      if (response.data.success) {
        showSnackbar(response.data.message, "success");
        setFetchTrigger(!fetchTrigger);
      } else {
        throw new Error(
          response.data.error || "Error occurred during deletion."
        );
      }
    } catch (error) {
      console.error("Error deleting phase:", error);
      showSnackbar(error.message || "Error deleting phase", "error");
    }
    setOpenDeleteDialog(false);
  };

  const contextValue = {
    projectId,
    newPhase,
    setNewPhase,
    handleCreatePhaseSubmit,
    showSnackbar,
    refreshPhaseList,
    handleExpandClick,
    openTaskAssignModal,
    openDeletePhaseDialog,
    deletePhase,
    setOpenDeleteDialog,
    openEditPhaseDialog, 
    handleUpdatePhaseSubmit
    // Include other states and functions that you want to provide in the context
  };

  return (
    <PhaseContext.Provider value={contextValue}>
      <StyledCard
        sx={{
          maxHeight: "500px",
          width: "450px",
          display: "flex",
          flexDirection: "column",
          boxShadow: 3,
          borderRadius: 5,
          mb: 2,
        }}
      >
        <CardHeader
          title="Phases"
          action={
            <IconButton onClick={() => setShowCreateModal(true)}>
              <AddRoundedIcon />
            </IconButton>
          }
          titleTypographyProps={{ variant: "h6", align: "center" }}
        />
        <CardContent>
          <List
            sx={{
              maxHeight: "450px",
              overflowY: "auto",
            }}
          >
            {phasesData.map((phase) => (
              <PhaseListItem
                key={phase._id}
                phase={phase}
                expanded={expanded}
              />
            ))}
          </List>
        </CardContent>
        {showCreateModal && (
          <CreatePhaseModal
            open={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}

        {showEditModal && (
        <EditPhaseModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          phaseToEdit={phaseToEdit}
        />
      )}
        {showTaskAssignModal && (
          <TaskAssignModal
            open={showTaskAssignModal}
            onClose={() => setShowTaskAssignModal(false)}
            phaseId={selectedPhaseId}
            onTaskAssigned={() => {
              setShowTaskAssignModal(false);
              setFetchTrigger(!fetchTrigger);
            }}
          />
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Dialog
          open={openDeleteDialog} // Corrected from openDeletePhaseDialog
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>{"Confirm Phase Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this phase?
              {hasAssignedTasks &&
                "This phase has assigned tasks. Deleting this phase will also delete its tasks. If you want to keep the tasks, please unassign them first."}
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={deletePhase} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </StyledCard>
    </PhaseContext.Provider>
  );
};

export default PhaseList;
