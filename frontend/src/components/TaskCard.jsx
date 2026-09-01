import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const STATUS_COLORS = {
  todo: "default",
  "in-progress": "warning",
  done: "success",
};

const PRIORITY_COLORS = {
  low: "info",
  medium: "warning",
  high: "error",
};

export default function TaskCard({ task, onStatusChange, onDelete }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6">{task.title}</Typography>
          <Chip
            label={task.priority}
            color={PRIORITY_COLORS[task.priority] || "default"}
            size="small"
          />
        </Stack>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {task.description}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Select
          size="small"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          color={STATUS_COLORS[task.status]}
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
        <IconButton
          aria-label="delete task"
          color="error"
          onClick={() => onDelete(task.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
