import { useState } from "react";
import "./App.css";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";

function App() {
  let [counter, setCounter] = useState(0);
  let [rows, setRows] = useState([]);

  /**
   *
   * @param {number} phenotype `0`, `1`, or `2`
   */
  function addEntry(phenotype) {
    let entry = { id: counter, entry: phenotype, timestamp: new Date() };
    setCounter(counter + 1);
    setRows([...rows, entry]);
  }

  const columns = [
    {
      field: "entry",
      headerName: "Entry",
      type: "number",
      width: 60,
      editable: true,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 200,
      editable: true,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      type: "date",
      valueFormatter: (params) => format(params.value, "yyyy-MM-dd HH:mm:ss"),
      width: 200,
    },
  ];

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
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: "timestamp", sort: "desc" }],
            },
          }}
          sx={{ height: "100%", fontFamily: "courier" }}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}

export default App;
