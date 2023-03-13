import { useState } from "react";
import "./App.css";

function App() {
  let [entries, setEntries] = useState([]);

  function addEntry(entry) {
    entries.push({ entry, timestamp: new Date() });
    setEntries([...entries]);
  }

  return (
    <div className="App">
      Señorita Elegance 🪱
      <div className="button-div">
        <button className="elegance-button" onClick={() => addEntry(0)}>
          0
        </button>
        <button className="elegance-button" onClick={() => addEntry(1)}>
          1
        </button>
        <button className="elegance-button" onClick={() => addEntry(2)}>
          2
        </button>
      </div>
    </div>
  );
}

export default App;
