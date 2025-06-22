import React, { useEffect, useState } from "react";
import Column from "./Column";
import TaskForm from "./TaskForm";
import styles from "./Board.module.css";
import axios from "axios";

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [editingBoard, setEditingBoard] = useState(null);
  const [editBoardName, setEditBoardName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTask = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const addBoard = async () => {
    if (!newBoardName.trim()) {
      setError("Board name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/addboard`,
        { name: newBoardName.trim() }
      );

      setBoards([...boards, response.data.board]);
      setNewBoardName("");
      setShowBoardForm(false);

      // Set as active if it's the first board
      if (boards.length === 0) {
        setActiveBoard(response.data.board._id);
      }
    } catch (error) {
      console.error("Error creating board:", error);
      setError("Failed to create board");
    } finally {
      setIsLoading(false);
    }
  };

  const getBoards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/getboard`
      );

      setBoards(response.data.boards);

      // Set first board as active if none is selected
      if (response.data.boards.length > 0 && !activeBoard) {
        setActiveBoard(response.data.boards[0]._id);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Failed to load boards");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBoards();
  }, []);

  const deleteBoard = async (boardId) => {
    if (boards.length <= 1) {
      setError("You must have at least one board");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this board? All tasks in it will be lost."
      )
    ) {
      setIsLoading(true);
      setError(null);

      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BACKEND_URL}/deleteboard/${boardId}`
        );

        const updatedBoards = boards.filter((board) => board._id !== boardId);
        setBoards(updatedBoards);
        setTasks(tasks.filter((task) => task.boardId !== boardId));

        if (activeBoard === boardId) {
          setActiveBoard(updatedBoards[0]?._id || null);
        }
      } catch (error) {
        console.error("Error deleting board:", error);
        setError("Failed to delete board");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateBoard = async () => {
    if (!editBoardName.trim() || !editingBoard) {
      setError("Board name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URL}/updateboard/${editingBoard}`,
        { name: editBoardName.trim() }
      );

      // Update local state with the updated board from server
      setBoards(
        boards.map((board) =>
          board._id === editingBoard ? response.data.board : board
        )
      );

      setEditingBoard(null);
      setEditBoardName("");
    } catch (error) {
      console.error("Error updating board:", error);
      setError("Failed to update board");
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(
      (task) => task.status === status && task.boardId === activeBoard
    );
  };

  const currentBoard = boards.find((b) => b._id === activeBoard) || {
    name: "",
  };
  

  return (
    <div className={styles.appWrapper}>
      <div className={styles.sidebar}>
        <h3>Boards</h3>
        {error && <div className={styles.error}>{error}</div>}
        {isLoading && <div className={styles.loading}>Loading...</div>}

        <ul>
          {boards.map((board) => (
            <li
              key={board._id}
              className={activeBoard === board._id ? styles.active : ""}
              onClick={() => setActiveBoard(board._id)}
            >
              <div className={styles.boardListItem}>
                <span>{board.name}</span>
                <div className={styles.boardActions}>
                  <button
                    className={styles.editBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBoard(board._id);
                      setEditBoardName(board.name);
                    }}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(board._id);
                    }}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => setShowBoardForm(true)} disabled={isLoading}>
          + Create new board
        </button>
      </div>

      <div className={styles.boardWrapper}>
        <div className={styles.header}>
          <h2>Board: {currentBoard.name}</h2>
          <button
            onClick={() => setShowForm(true)}
            disabled={isLoading || !activeBoard}
          >
            + Add Task
          </button>
        </div>

        {showForm && (
          <div className={styles.formOverlay}>
            <TaskForm
              onSave={(task) => {
                addTask(task);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
              boardId={activeBoard}
            />
          </div>
        )}

        {showBoardForm && (
          <div className={styles.formOverlay}>
            <div className={styles.boardForm}>
              <h3>Create new board</h3>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board name (e.g., 'Frontend Tasks')"
                autoFocus
                disabled={isLoading}
              />
              <div className={styles.formActions}>
                <button onClick={addBoard} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => setShowBoardForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {editingBoard && (
          <div className={styles.formOverlay}>
            <div className={styles.boardForm}>
              <h3>Edit board name</h3>
              <input
                type="text"
                value={editBoardName}
                onChange={(e) => setEditBoardName(e.target.value)}
                placeholder="New board name"
                autoFocus
                disabled={isLoading}
              />
              <div className={styles.formActions}>
                <button onClick={updateBoard} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setEditingBoard(null)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.board}>
          {["To Do", "In Progress", "Done"].map((status, idx) => (
            <Column key={idx} title={status} tasks={getTasksByStatus(status)} />
          ))}
        </div>
      </div>
    </div>
  );
}
