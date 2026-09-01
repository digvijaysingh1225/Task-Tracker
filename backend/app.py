"""
Task Tracker API
-----------------
A small REST backend built with Python (Flask) and MongoDB, created as a
demo full-stack project (Frontend: React + Material UI, Backend: Python,
DB: MongoDB, Version Control: Git/GitHub) matching the stack used by
Citi's Technology Apprenticeship Program.

Run:
    export MONGO_URI="mongodb://localhost:27017"   # or an Atlas URI
    python app.py

The API exposes CRUD endpoints for "tasks":
    GET    /api/tasks          -> list all tasks
    POST   /api/tasks          -> create a task
    GET    /api/tasks/<id>     -> get one task
    PUT    /api/tasks/<id>     -> update a task
    DELETE /api/tasks/<id>     -> delete a task
    GET    /api/health         -> health check
"""

import os
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "task_tracker")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
db = client[DB_NAME]
tasks_collection = db["tasks"]


def serialize_task(task):
    return {
        "id": str(task["_id"]),
        "title": task.get("title", ""),
        "description": task.get("description", ""),
        "status": task.get("status", "todo"),
        "priority": task.get("priority", "medium"),
        "created_at": task.get("created_at"),
        "updated_at": task.get("updated_at"),
    }


@app.get("/api/health")
def health():
    try:
        client.admin.command("ping")
        db_status = "connected"
    except ConnectionFailure:
        db_status = "disconnected"
    return jsonify({"status": "ok", "database": db_status})


@app.get("/api/tasks")
def get_tasks():
    status_filter = request.args.get("status")
    query = {"status": status_filter} if status_filter else {}
    tasks = tasks_collection.find(query).sort("created_at", -1)
    return jsonify([serialize_task(t) for t in tasks])


@app.post("/api/tasks")
def create_task():
    data = request.get_json(force=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400

    now = datetime.now(timezone.utc).isoformat()
    task = {
        "title": title,
        "description": data.get("description", ""),
        "status": data.get("status", "todo"),
        "priority": data.get("priority", "medium"),
        "created_at": now,
        "updated_at": now,
    }
    result = tasks_collection.insert_one(task)
    task["_id"] = result.inserted_id
    return jsonify(serialize_task(task)), 201


@app.get("/api/tasks/<task_id>")
def get_task(task_id):
    try:
        task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    except InvalidId:
        return jsonify({"error": "invalid task id"}), 400
    if not task:
        return jsonify({"error": "task not found"}), 404
    return jsonify(serialize_task(task))


@app.put("/api/tasks/<task_id>")
def update_task(task_id):
    try:
        oid = ObjectId(task_id)
    except InvalidId:
        return jsonify({"error": "invalid task id"}), 400

    data = request.get_json(force=True) or {}
    updates = {}
    for field in ("title", "description", "status", "priority"):
        if field in data:
            updates[field] = data[field]
    if not updates:
        return jsonify({"error": "no valid fields to update"}), 400

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = tasks_collection.find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=True
    )
    if not result:
        return jsonify({"error": "task not found"}), 404
    return jsonify(serialize_task(result))


@app.delete("/api/tasks/<task_id>")
def delete_task(task_id):
    try:
        oid = ObjectId(task_id)
    except InvalidId:
        return jsonify({"error": "invalid task id"}), 400
    result = tasks_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        return jsonify({"error": "task not found"}), 404
    return jsonify({"deleted": True})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
