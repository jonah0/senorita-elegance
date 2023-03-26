import { useState, useEffect, useMemo } from "react";
import { default as clipboardCopy } from "clipboard-copy";
import "./App.css";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  useGridApiRef,
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

const LOCAL_STORAGE_ID_COUNTER = "spermatheca-logger-id-counter";
const LOCAL_STORAGE_SPERMATHECA_ROWS = "spermatheca-logger-rows";

const ZERO_COLOR = "#FA003F"; // real bright red
// const ZERO_COLOR = "#EF476F"; // bright pink
const ONE_COLOR = "#1976D2";
const TWO_COLOR = "#FBAF00";

function App() {
  const apiRef = useGridApiRef();

  let [counter, setCounter] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem(LOCAL_STORAGE_ID_COUNTER);
    return parseInt(saved) || 0;
  });

  let [rowMap, setRowMap] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem(LOCAL_STORAGE_SPERMATHECA_ROWS);
    const initialValue = new Map(JSON.parse(saved));
    return initialValue || new Map();
  });

  let rows = useMemo(() => {
    return Array.from(rowMap, ([key, value]) => value);
  }, [rowMap]);

  let [gene, setGene] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  let [alertOpen, setAlertOpen] = useState(false);
  let [deleteSelectionDialogOpen, setDeleteSelectionDialogOpen] =
    useState(false);

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
    rowMap.set(counter, entry);
    setRowMap(new Map(rowMap)); // need shallow copy to trigger rerender
    setCounter(counter + 1);
  }

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_SPERMATHECA_ROWS,
      JSON.stringify([...rowMap])
    );
  }, [rowMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ID_COUNTER, counter);
  }, [counter]);

  const columns = [
    {
      field: "phenotype",
      headerName: "Phenotype",
      type: "number",
      width: 90,
      editable: true,
      renderCell: ({ value }) => {
        let color = "white";
        if (value === 0) {
          color = ZERO_COLOR;
        } else if (value === 1) {
          color = ONE_COLOR;
        } else if (value === 2) {
          color = TWO_COLOR;
        }
        return (
          <div
            className="phenotype-indicator-square"
            style={{ backgroundColor: color }}
          >
            {value}
          </div>
        );
      },
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
      width: 500,
      editable: true,
    },
  ];

  function csvFileName() {
    return `${new Date().toISOString()}_${rowMap.size}_rows_senorita_elegance`;
  }

  async function handleShare(e) {
    console.log("Sharing CSV...");
    let csvString = apiRef.current.getDataAsCsv();
    let filename = csvFileName() + ".csv";

    const file = new File([csvString], filename, {
      type: "text/csv",
    });

    try {
      await navigator.share({ title: filename, files: [file] });
      console.log("CSV shared successfully");
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Button disabled>{rowMap.size} Rows</Button>
        {/* <GridToolbarColumnsButton /> */}
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarExport
          csvOptions={{
            allColumns: true,
            utf8WithBom: false,
            fileName: csvFileName(),
          }}
        />
        <Button
          onClick={() => {
            let csvString = apiRef.current.getDataAsCsv();
            console.log(csvString);
            clipboardCopy(csvString);
          }}
        >
          Copy As CSV
        </Button>
        <Button onClick={handleShare}>Share...</Button>
        <Button
          disabled={selectionModel.length === 0}
          onClick={(e) => setDeleteSelectionDialogOpen(true)}
        >
          {selectionModel.length < rowMap.size
            ? `Delete ${selectionModel.length} Rows`
            : `Clear All`}
        </Button>
        {/* <Button
          disabled={rowMap.size === 0}
          onClick={(e) => setAlertOpen(true)}
        >
          CLEAR ALL
        </Button> */}
      </GridToolbarContainer>
    );
  }

  function handleCloseDeleteSelectionDialog(e) {
    setDeleteSelectionDialogOpen(false);
  }

  function handleCloseDialog(e) {
    setAlertOpen(false);
  }

  function clearSelectedData(e) {
    const selectedIDs = new Set(selectionModel);
    selectedIDs.forEach((id) => rowMap.delete(id));
    setRowMap(new Map(rowMap));
    handleCloseDeleteSelectionDialog();
  }

  function clearAllData(e) {
    setRowMap(new Map());
    setCounter(0);
    handleCloseDialog();
  }

  return (
    <div className="App">
      <p>🧬 Sᴘᴇʀᴍᴀᴛʜᴇᴄᴀ Cᴏᴜɴᴛᴇʀ 🧬</p>
      <div className="button-div">
        <Button
          style={{
            margin: "3pt",
            fontSize: "x-large",
            fontFamily: "courier",
            backgroundColor: ZERO_COLOR,
          }}
          className="elegance-button"
          variant="contained"
          disableElevation
          onClick={() => addEntry(0)}
        >
          0
        </Button>
        <Button
          style={{
            margin: "3pt",
            fontSize: "x-large",
            fontFamily: "courier",
            backgroundColor: ONE_COLOR,
          }}
          className="elegance-button"
          variant="contained"
          disableElevation
          onClick={() => addEntry(1)}
        >
          1
        </Button>
        <Button
          style={{
            margin: "3pt",
            fontSize: "x-large",
            fontFamily: "courier",
            backgroundColor: TWO_COLOR,
          }}
          className="elegance-button"
          variant="contained"
          disableElevation
          onClick={() => addEntry(2)}
        >
          2
        </Button>
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
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          initialState={{
            sorting: {
              sortModel: [{ field: "timestamp", sort: "desc" }],
            },
          }}
          sx={{
            height: "100%",
            fontFamily: "inherit",
            fontWeight: "inherit",
          }}
          onRowSelectionModelChange={(ids) => {
            setSelectionModel(ids);
          }}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          density="compact"
          editMode="cell"
          processRowUpdate={(newRow, oldRow) => {
            rowMap.set(newRow.id, newRow);
            setRowMap(new Map(rowMap));
            return newRow;
          }}
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
              This will clear all local spermatheca data. This action is
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
      <div>
        <Dialog
          open={deleteSelectionDialogOpen}
          onClose={() => setDeleteSelectionDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete {selectionModel.length} Rows? 🪱🗑️
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will clear the selected rows. This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteSelectionDialog}>Cancel</Button>
            <Button onClick={clearSelectedData} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
