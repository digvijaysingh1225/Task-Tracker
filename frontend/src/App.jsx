import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import { getTasks, createTask, updateTask, deleteTask } from "./api";

const TABS = [
  { label: "All", value: "" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(tab || undefined);
      setTasks(data);
    } catch (err) {
      setError(
        "Could not reach the API. Make sure the Flask backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (task) => {
    await createTask(task);
    load();
  };

  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status });
    load();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    load();
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Task Tracker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        React + Material UI frontend calling a Python (Flask) REST API backed
        by MongoDB.
      </Typography>

      <TaskForm onCreate={handleCreate} />

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mb: 2 }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks yet.</Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))
      )}
    </Container>
  );
}
