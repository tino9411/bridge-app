//theme.js
// Desc: This file contains the theme for the application
import { createTheme } from '@mui/material/styles';
import { blue, orange, green, red, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    status: {
      "open": blue[500],
      "in progress": orange[500],
      "completed": green[500],
      "on hold": red[500],
    },
    priority: {
      low: green[700],
      medium: orange[700],
      high: red[700],
      new: grey[700],
    },
  },
  title: {
    fontSize: 12,
    },
  // Add other customizations here
});

export default theme;
