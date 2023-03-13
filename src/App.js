import { useState } from "react";
import "./App.css";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { TextField, FormControl, Button } from "@mui/material";

function App() {
  let [counter, setCounter] = useState(0);
  let [rows, setRows] = useState([]);
  let [gene, setGene] = useState("");

  /**
   *
   * @param {number} phenotype `0`, `1`, or `2`
   */
  function addEntry(phenotype) {
    let entry = {
      id: counter,
      phenotype,
      gene,
      timestamp: new Date(),
    };
    setCounter(counter + 1);
    setRows([...rows, entry]);
  }

  const columns = [
    {
      field: "phenotype",
      headerName: "Phenotype",
      type: "number",
      width: 90,
      editable: true,
    },
    {
      field: "gene",
      headerName: "Gene",
      width: 200,
      editable: true,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      type: "date",
      valueFormatter: (params) => format(params.value, "HH:mm:ss yyyy-MM-dd"),
      width: 200,
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 200,
      editable: true,
    },
    {
      field: "delete",
      width: 75,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => {
        return <button>test button</button>;
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button>Delete</Button>
      </GridToolbarContainer>
    );
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
      <div style={{ margin: "5px", textAlign: "left" }}>
        <FormControl>
          <TextField
            variant="standard"
            label="Gene"
            value={gene}
            onChange={(e) => setGene(e.target.value)}
          ></TextField>
        </FormControl>
      </div>
      <div className="data-grid-div">
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: "timestamp", sort: "desc" }],
            },
          }}
          slots={{ toolbar: CustomToolbar }}
          sx={{ height: "100%", fontFamily: "courier" }}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
}

export default App;
