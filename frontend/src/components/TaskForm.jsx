import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

const PRIORITIES = ["low", "medium", "high"];

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description, priority, status: "todo" });
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add a new task
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 140 } }}
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
            Add Task
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
