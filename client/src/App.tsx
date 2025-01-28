import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <img
          src="data:image/png;base64,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"
          alt="Scan QR Code"
        />

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
