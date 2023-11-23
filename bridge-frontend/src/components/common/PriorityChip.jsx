import React from 'react';
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

const PriorityChip = ({ label }) => {
  const theme = useTheme();
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: theme.palette.priority[label.toLowerCase()],
        color: "common.white",
        m: 0.1,
        fontSize: "0.6rem",
      }}
    />
  );
};

export default PriorityChip;
