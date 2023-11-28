//chipUtils.js

import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import React from "react";


// This function takes an array of skills and returns a list of Chips
export const renderSkillsAsChips = (skillsNeeded) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    {skillsNeeded.map((skill, index) => (
      <Chip key={index} label={skill} sx={{ bgcolor: "primary.main", color: "common.white" }} />
    ))}
  </Box>
);
