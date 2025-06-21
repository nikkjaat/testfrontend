import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Board.module.css";

const STATUSES = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function TaskForm({ onSave, onCancel, boardId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [tasks, setTasks] = useState([]); // 👈 for displaying tasks

  // Fetch tasks for the given board
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/tasks`
      );
      console.log(response);
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Call when component mounts or boardId changes
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newTask = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assignedTo: assignedTo.trim(),
        dueDate,
        boardId,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/tasks`,
        newTask
      );

      onSave(response.data.task);

      // Reset form
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setAssignedTo("");
      setDueDate("");

      // Refetch updated list
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.taskForm}>
        <h3>Add New Task</h3>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="task-title">Title*</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isLoading}
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="task-assigned">Assigned To</label>
            <input
              id="task-assigned"
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Task"}
          </button>
          <button type="button" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </form>

      {/* 👇 TASK LIST RENDERING */}
      <div className={styles.taskList}>
        <h3>Tasks in this Board</h3>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className={styles.taskItem}>
                <strong>{task.title}</strong> — {task.status}, {task.priority}
                <br />
                <small>Assigned to: {task.assignedTo || "N/A"}</small>
                {task.dueDate && (
                  <>
                    <br />
                    <small>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
