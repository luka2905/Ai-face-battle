import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className="App">
      <h1>React App mit Vite</h1>
      <p>Aktueller Zählerstand: {count}</p>
      <button onClick={increment}>Erhöhen</button>
      <button onClick={decrement}>Verringern</button>
    </div>
  );
}

export default App;
