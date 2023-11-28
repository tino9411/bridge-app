//cardUtils.js
import { Card } from "@mui/material";
import React from "react";

export const StyledCard = ({ children, ...props }) => (
  <Card
     sx={{
          width: "80%",
          maxWidth: 1000,
          maxHeight: "100%",
          bgcolor: "background.paper",
          borderRadius: 5,
          boxShadow: 24,
        }}
    {...props}
  >
    {children}
  </Card>
);
