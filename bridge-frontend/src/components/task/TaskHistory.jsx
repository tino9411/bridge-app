// TaskHistory.jsx
import React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";

const TaskHistory = ({ task }) => {
  const importantFields = [
    "status",
    "dueDate",
    "rate",
    "phase",
    "priority",
    "location",
    "description",
    "relatedRequests",
  ]; // Focus on these fields
  const formatDetail = (value) => {
    if (
      value instanceof Date ||
      (typeof value === "string" && Date.parse(value))
    ) {
      return new Date(value).toLocaleDateString(); // Format date strings and Date objects
    }
    if (value && typeof value === "object") {
      if (value.username) return value.username; // For User objects
      if (value.name) return value.name; // For other objects with 'name' field
      return JSON.stringify(value); // Fallback for other object types
    }
    return value; // Return primitive types as-is
  };

  const renderDetail = (detail) => {
    const oldValueFormatted = formatDetail(detail.oldValue);
    const newValueFormatted = formatDetail(detail.newValue);

    // Skip rendering if there's no actual change
    if (oldValueFormatted === newValueFormatted) {
      return null;
    }

    switch (detail.field) {
      case "phase":
        if (newValueFormatted) {
          return `Assigned to phase: ${newValueFormatted}`;
        }
        return `Removed from phase: ${oldValueFormatted}`;
      case "assignee":
        if (newValueFormatted && newValueFormatted !== oldValueFormatted) {
          return `Assignee changed to: ${newValueFormatted}`;
        } else if (!newValueFormatted) {
          return `Assignee removed: ${oldValueFormatted}`;
        }
        break; // No change in assignee
      case "priority":
        return `Priority changed from "${oldValueFormatted}" to "${newValueFormatted}"`;
      case "tags":
        return `Tags updated`;
      case "checklistItems":
        return `Checklist items updated`;
      case "files":
        return `File attachments updated`;
      case "dueDate":
      case "description":
        return `${detail.field} updated`;
      case "location":
        return `${detail.field} set to: ${newValueFormatted}`;
      case "relatedRequests":
      case "status":
      case "rate":
        return `${detail.field}: Changed from "${oldValueFormatted}" to "${newValueFormatted}"`;
      default:
        return `${detail.field}: Updated`;
    }

    return null; // In case of no significant change to display
  };

  const actionColors = {
    "Task Updated": "secondary",
    "Task Assigned to Phase": "primary",
    "Task Removed from Phase": "error",
  };

  return (
    <Timeline position="alternate">
      {task.history
        .slice()
        .reverse()
        .map((log, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {new Date(log.date).toLocaleString()}{" "}
              {/* Format date for display */}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                color={actionColors[log.action] || "grey"}
                variant="outlined"
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6">{log.action}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ fontSize: "0.8rem" }}
              >
                {log.description}
              </Typography>
              {log.details &&
                log.details
                  .filter(
                    (detail) =>
                      importantFields.includes(detail.field) &&
                      formatDetail(detail.oldValue) !==
                        formatDetail(detail.newValue)
                  )
                  .map((detail, detailIndex) => (
                    <Typography
                      key={detailIndex}
                      variant="body2"
                      style={{ fontSize: "0.75rem", color: "gray" }}
                    >
                      {detail.field}: Changed from "
                      {formatDetail(detail.oldValue)}" to "
                      {formatDetail(detail.newValue)}"
                    </Typography>
                  ))}
            </TimelineContent>
          </TimelineItem>
        ))}
    </Timeline>
  );
};

export default TaskHistory;
