/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableRow, TableColumn } from '../types';

// Defining the initial state structure and types
interface TableState {
  rows: TableRow[];
  columns: TableColumn[];
  visibleColumns: string[];
  columnOrder: string[]; // Track column order
  search: string;
  sort: { field: string; direction: 'asc' | 'desc' };
  page: number;
  rowsPerPage: number;
  theme: 'light' | 'dark';
}

// Default columns and rows for demonstration
const initialColumns: TableColumn[] = [
  { field: 'name', label: 'Name', type: 'string', editable: true },
  { field: 'email', label: 'Email', type: 'string', editable: true },
  { field: 'age', label: 'Age', type: 'number', editable: true },
  { field: 'role', label: 'Role', type: 'string', editable: true },
];

// Sample rows for the table
const sampleRows: TableRow[] = [
  { name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager' },
  {
    name: 'Alice Brown',
    email: 'alice@example.com',
    age: 29,
    role: 'Developer',
  },
  {
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    age: 35,
    role: 'Analyst',
  },
];

// Initial state for the table
const initialState: TableState = {
  rows: sampleRows,
  columns: initialColumns,
  visibleColumns: initialColumns.map((c) => c.field),
  columnOrder: initialColumns.map((c) => c.field),
  search: '',
  sort: { field: 'name', direction: 'asc' },
  page: 0,
  rowsPerPage: 10,
  theme: 'light',
};

// Create the slice
export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<TableRow[]>) {
      state.rows = action.payload;
    },
    addColumn(state, action: PayloadAction<TableColumn>) {
      state.columns.push(action.payload);
      state.visibleColumns.push(action.payload.field);
      state.columnOrder.push(action.payload.field); // Add new column to order
    },
    deleteColumn(state, action: PayloadAction<string>) {
      const fieldToDelete = action.payload;

      // Remove from columns array
      state.columns = state.columns.filter(
        (col) => col.field !== fieldToDelete
      );

      // Remove from visible columns
      state.visibleColumns = state.visibleColumns.filter(
        (field) => field !== fieldToDelete
      );

      // Remove from column order
      state.columnOrder = state.columnOrder.filter(
        (field) => field !== fieldToDelete
      );

      // Remove the field from all rows
      state.rows = state.rows.map((row) => {
        const { [fieldToDelete]: _unused, ...rest } = row;
        return rest;
      });
    },
    setVisibleColumns(state, action: PayloadAction<string[]>) {
      state.visibleColumns = action.payload;
    },
    reorderColumns(
      state,
      action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>
    ) {
      const { sourceIndex, destinationIndex } = action.payload;
      const newColumnOrder = Array.from(state.columnOrder); // Create a copy of the order
      const [reorderedItem] = newColumnOrder.splice(sourceIndex, 1); // Remove the column from the source index
      newColumnOrder.splice(destinationIndex, 0, reorderedItem); // Insert it at the destination index
      state.columnOrder = newColumnOrder; // Update the column order
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 0; // Reset to first page when searching
    },
    setSort(
      state,
      action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>
    ) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    addRow(state, action: PayloadAction<TableRow>) {
      state.rows.push(action.payload);
    },
    updateRow(state, action: PayloadAction<{ index: number; row: TableRow }>) {
      const { index, row } = action.payload;
      if (state.rows[index]) {
        state.rows[index] = row;
      }
    },
    deleteRow(state, action: PayloadAction<number>) {
      state.rows.splice(action.payload, 1);
    },
  },
});

// Exporting actions for use in components
export const {
  setRows,
  addColumn,
  deleteColumn,
  setVisibleColumns,
  reorderColumns, // Action to reorder columns
  setSearch,
  setSort,
  setPage,
  setTheme,
  addRow,
  updateRow,
  deleteRow,
} = tableSlice.actions;

// Export the reducer to be used in store
export const tableReducer = tableSlice.reducer;
