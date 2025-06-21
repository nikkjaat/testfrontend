import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1>Navbar</h1>
      <button className={styles.loginButton}>Login</button>
    </nav>
  );
}
