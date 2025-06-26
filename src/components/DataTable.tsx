'use client';
import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridRowModel,
} from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setSort,
  setPage,
  setRows,
  setSearch,
  reorderColumns,
} from '../redux/tableSlice';
import {
  TextField,
  Box,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

const DataTable: React.FC = () => {
  const dispatch = useDispatch();
  const {
    rows,
    columns,
    visibleColumns,
    columnOrder,
    sort,
    page,
    rowsPerPage,
    search,
  } = useSelector((state: RootState) => state.table);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [showColumnReorder, setShowColumnReorder] = useState(false);

  // Filter rows based on global search
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // Add actions column
  const actionColumn: GridColDef = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <>
        <IconButton
          aria-label="edit"
          onClick={() => alert('Double-click any cell to edit inline')}
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => {
            setRowToDelete(params.id as number);
            setDeleteDialogOpen(true);
          }}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  };

  // Order columns based on columnOrder and filter by visibility
  const orderedColumns = columnOrder
    .map((fieldName) => columns.find((col) => col.field === fieldName))
    .filter((col): col is NonNullable<typeof col> => col !== undefined)
    .filter((col) => visibleColumns.includes(col.field));

  const gridColumns: GridColDef[] = orderedColumns.map((col) => ({
    field: col.field,
    headerName: col.label,
    width: 150,
    editable: col.editable,
    sortable: true,
  }));

  gridColumns.push(actionColumn);

  const gridRows: GridRowsProp = filteredRows.map((row, idx) => ({
    id: idx,
    ...row,
  }));

  // Handle column reordering
  const handleColumnReorder = (result: DropResult) => {
    if (!result.destination) return;

    dispatch(
      reorderColumns({
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
      })
    );
  };

  // Handle row update with validation
  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    // Validate age field if present
    if ('age' in newRow) {
      const ageValue = newRow.age;
      if (
        ageValue !== undefined &&
        (isNaN(Number(ageValue)) || Number(ageValue) < 0)
      ) {
        alert('Age must be a non-negative number');
        throw new Error('Invalid age');
      }
    }

    // Update the rows in Redux
    const updatedRows = [...rows];
    const rowIndex = oldRow.id as number;
    if (updatedRows[rowIndex]) {
      const { id, ...rowData } = newRow;
      updatedRows[rowIndex] = rowData;
      dispatch(setRows(updatedRows));
    }

    return newRow;
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete !== null) {
      const updatedRows = rows.filter((_, idx) => idx !== rowToDelete);
      dispatch(setRows(updatedRows));
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  // Save all changes
  const handleSaveAll = () => {
    const updatedRows = gridRows.map((row) => {
      const { id, ...rest } = row;
      return rest;
    });

    dispatch(setRows(updatedRows));
    setIsEditing(false);
    alert('All changes saved successfully!');
  };

  // Cancel all changes
  const handleCancelAll = () => {
    setIsEditing(false);
    window.location.reload(); // Simple way to revert changes
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="🔍 Search all fields"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
        placeholder="Type to search across all columns..."
      />

      {/* Column Reorder Toggle */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<DragIndicatorIcon />}
          onClick={() => setShowColumnReorder(!showColumnReorder)}
          size="small"
        >
          {showColumnReorder ? 'Hide' : 'Show'} Column Reorder
        </Button>
        <Typography variant="body2" color="text.secondary">
          💡 Tip: Double-click any cell to edit inline
        </Typography>
      </Box>

      {/* Column Reorder Interface */}
      {showColumnReorder && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            🧭 Drag to Reorder Columns
          </Typography>
          <DragDropContext onDragEnd={handleColumnReorder}>
            <Droppable droppableId="columns" direction="horizontal">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                >
                  {orderedColumns.map((col, index) => (
                    <Draggable
                      key={col.field}
                      draggableId={col.field}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Chip
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          label={col.label}
                          icon={<DragIndicatorIcon />}
                          variant={
                            visibleColumns.includes(col.field)
                              ? 'filled'
                              : 'outlined'
                          }
                          color={snapshot.isDragging ? 'primary' : 'default'}
                          sx={{
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            opacity: snapshot.isDragging ? 0.8 : 1,
                            transform: snapshot.isDragging
                              ? 'rotate(5deg)'
                              : 'none',
                          }}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      )}

      <DataGrid
        rows={gridRows}
        columns={gridColumns}
        pageSize={rowsPerPage}
        page={page}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        sortingOrder={['asc', 'desc']}
        sortModel={[{ field: sort.field, sort: sort.direction }]}
        onSortModelChange={(model) => {
          if (model.length) {
            dispatch(
              setSort({
                field: model[0].field,
                direction: model[0].sort as 'asc' | 'desc',
              })
            );
          }
        }}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        editMode="row"
        processRowUpdate={processRowUpdate}
        onRowEditStart={() => setIsEditing(true)}
        onRowEditStop={() => setIsEditing(false)}
        sx={{
          '& .MuiDataGrid-cell:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
        }}
      />

      {isEditing && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveAll}>
            💾 Save All Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelAll}
          >
            ❌ Cancel All Changes
          </Button>
        </Stack>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">🗑️ Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this row? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;
