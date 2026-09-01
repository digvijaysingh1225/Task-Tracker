import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_BASE });

export const getTasks = (status) =>
  api.get("/tasks", { params: status ? { status } : {} }).then((r) => r.data);

export const createTask = (task) => api.post("/tasks", task).then((r) => r.data);

export const updateTask = (id, updates) =>
  api.put(`/tasks/${id}`, updates).then((r) => r.data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);
