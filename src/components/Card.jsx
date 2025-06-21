import React from "react";
import styles from "./Card.module.css";

export default function Card({ text }) {
  return <div className={styles.card}>{text}</div>;
}
