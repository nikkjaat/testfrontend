// Column.js
import React from "react";
import styles from "./Board.module.css";

export default function Column({ title, tasks }) {
  return (
    <div className={styles.column}>
      <h3>{title}</h3>
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.taskHeader}>
              <span
                className={`${styles.priority} ${
                  styles[task.priority.toLowerCase()]
                }`}
              >
                {task.priority}
              </span>
              <h4>{task.title}</h4>
            </div>
            {task.description && (
              <p className={styles.taskDescription}>{task.description}</p>
            )}

            <div className={styles.taskMeta}>
              {task.assignedTo && (
                <span className={styles.assignedTo}>{task.assignedTo}</span>
              )}
              {task.dueDate && (
                <span className={styles.dueDate}>
                  {" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
