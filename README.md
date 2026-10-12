# Task Tracker

A small full-stack task management app: **React.js + Material UI** on the
frontend, **Python (Flask)** on the backend, **MongoDB** for storage, and
**Git/GitHub** for version control.

## Features

- Create tasks with a title, description, and priority (low/medium/high)
- Move tasks between statuses: To Do -> In Progress -> Done
- Filter tasks by status using tabs
- Delete tasks
- Responsive Material UI layout (stacks vertically on mobile, in a row on
  desktop)

## Tech stack

| Layer            | Technology                                   |
|-------------------|-----------------------------------------------|
| Frontend          | React.js, Material UI (MUI), Axios            |
| Backend           | Python, Flask, Flask-CORS                     |
| Database          | MongoDB (via PyMongo)                         |
| Version control   | Git / GitHub                                  |

## Project structure

```
task-tracker/
├── backend/
│   ├── app.py            # Flask REST API (CRUD for tasks)
│   └── requirements.txt
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── index.js
│       └── components/
│           ├── TaskForm.jsx
│           └── TaskCard.jsx
└── README.md
```

## Running locally

### 1. MongoDB

Use a local MongoDB install, Docker, or a free MongoDB Atlas cluster. Get a
connection string, e.g. `mongodb://localhost:27017` or an Atlas URI.

### 2. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
export MONGO_URI="mongodb://localhost:27017"       # your connection string
python app.py
```

The API runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000` and talks to the API at
`http://localhost:5000/api` (override with an `REACT_APP_API_BASE` env var if
needed).

## API endpoints

| Method | Endpoint            | Description       |
|--------|----------------------|--------------------|
| GET    | /api/health          | Health check       |
| GET    | /api/tasks           | List tasks (optional `?status=` filter) |
| POST   | /api/tasks           | Create a task       |
| GET    | /api/tasks/<id>       | Get one task        |
| PUT    | /api/tasks/<id>       | Update a task       |
| DELETE | /api/tasks/<id>       | Delete a task       |

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Task Tracker (React + Flask + MongoDB)"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

## Notes for future work

- Add authentication (JWT) so tasks are scoped per user.
- Add pagination / search on the tasks list.
- Containerize with Docker Compose (frontend + backend + mongo).
- Add unit tests (pytest for backend, React Testing Library for frontend).
- Deploy backend + Mongo on a small cloud instance and frontend on
  Netlify/Vercel, or explore Citi JD's optional stack (Terraform + AWS
  Serverless: S3/CloudFront for the frontend, Lambda for the API).
