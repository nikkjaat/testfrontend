import { useState } from "react";

import "./App.css";
import Navbar from "./navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authform from "./components/Authform";
import Board from "./components/Board";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/signup" element={<Authform />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
