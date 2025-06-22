import React, { useState } from "react";
import styles from "./Authform.module.css";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(false); // toggle between Login/Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/login" : "/signup";

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}${endpoint}`,
        isLogin ? { email, password } : { name, email, password }
      );

      alert(data.message);
      if (data.success) {
        // navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitForm} className={styles.form}>
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        {!isLogin && (
          <>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.submitBtn} type="submit">
          {isLogin ? "Login" : "Signup"}
        </button>

        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}
