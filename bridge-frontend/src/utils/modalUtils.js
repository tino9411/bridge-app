import { Modal } from "@mui/material";
import React from "react";

export const StyledModal = ({ open, onClose, children, ...props }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="task-modal-title"
    aria-describedby="task-modal-description"
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 1,
      // Add more styling as needed
    }}
    {...props}
  >
    {children}
  </Modal>
);
