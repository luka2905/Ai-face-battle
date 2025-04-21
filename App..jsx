import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>🔥 AI Face Battle 🔥</h1>
      <p>Dein Punktestand: {count}</p>
      <button onClick={() => setCount(count + 1)}>+ Punkt</button>
    </div>
  );
}

export default App;
