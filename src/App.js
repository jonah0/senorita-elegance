import { useState, useEffect } from "react";
import "./App.css";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { format, isValid, parseISO } from "date-fns";
import {
  TextField,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

function App() {
  let [counter, setCounter] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("senorita-elegance-id-counter");
    return parseInt(saved) || 0;
  });

  let [rows, setRows] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("senorita-elegance-rows");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  console.log({ rows });

  let [gene, setGene] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  let [alertOpen, setAlertOpen] = useState(false);

  /**
   *
   * @param {number} phenotype `0`, `1`, or `2`
   */
  function addEntry(phenotype) {
    let entry = {
      id: counter,
      phenotype,
      gene,
      timestamp: new Date().toISOString(),
    };
    setCounter(counter + 1);
    setRows([...rows, entry]);
  }

  useEffect(() => {
    localStorage.setItem("senorita-elegance-rows", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem("senorita-elegance-id-counter", counter);
  }, [counter]);

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
      width: 175,
      editable: true,
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 200,

      // type: "date",
      // valueFormatter: (params) => {
      //   if (isValid(params.value)) {
      //     return format(params.value, "HH:mm:ss yyyy-MM-dd");
      //   } else {
      //     let dateobj = parseISO(params.value);
      //     return format(dateobj, "HH:mm:ss yyyy-MM-dd");
      //   }
      // },

      renderCell: ({ value }) => {
        if (isValid(value)) {
          return format(value, "HH:mm:ss yyyy-MM-dd");
        } else {
          let dateobj = parseISO(value);
          return format(dateobj, "HH:mm:ss yyyy-MM-dd");
        }
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 200,
      editable: true,
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            allColumns: true,
            fileName: `${new Date().toISOString()}_${
              rows.length
            }_rows_senorita_elegance`,
          }}
        />
        <Button
          disabled={selectionModel.length === 0}
          onClick={() => {
            const selectedIDs = new Set(selectionModel);
            setRows((r) => r.filter((x) => !selectedIDs.has(x.id)));
          }}
        >
          Delete {selectionModel.length} Rows
        </Button>
        <Button
          disabled={rows.length === 0}
          onClick={(e) => setAlertOpen(true)}
        >
          CLEAR ALL
        </Button>
      </GridToolbarContainer>
    );
  }

  function handleCloseDialog(e) {
    setAlertOpen(false);
  }

  function clearAllData(e) {
    setRows([]);
    setCounter(0);
    handleCloseDialog();
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
          onRowSelectionModelChange={(ids) => {
            setSelectionModel(ids);
          }}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          density="compact"
        />
      </div>
      <div>
        <Dialog
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete {rows.length} Rows? 🪱🗑️
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will clear all local Señorita Elegance data. This action is
              irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={clearAllData} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
