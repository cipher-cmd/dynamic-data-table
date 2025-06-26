import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableRow, TableColumn } from '../types';

interface TableState {
  rows: TableRow[];
  columns: TableColumn[];
  visibleColumns: string[];
  columnOrder: string[]; // NEW: Track column order
  search: string;
  sort: { field: string; direction: 'asc' | 'desc' };
  page: number;
  rowsPerPage: number;
  theme: 'light' | 'dark';
}

const initialColumns: TableColumn[] = [
  { field: 'name', label: 'Name', type: 'string', editable: true },
  { field: 'email', label: 'Email', type: 'string', editable: true },
  { field: 'age', label: 'Age', type: 'number', editable: true },
  { field: 'role', label: 'Role', type: 'string', editable: true },
];

// Sample data for demonstration
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

const initialState: TableState = {
  rows: sampleRows,
  columns: initialColumns,
  visibleColumns: initialColumns.map((c) => c.field),
  columnOrder: initialColumns.map((c) => c.field), // NEW: Initialize column order
  search: '',
  sort: { field: 'name', direction: 'asc' },
  page: 0,
  rowsPerPage: 10,
  theme: 'light',
};

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
      state.columnOrder.push(action.payload.field); // NEW: Add to column order
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
      // Remove field from all rows
      state.rows = state.rows.map((row) => {
        const { [fieldToDelete]: deleted, ...rest } = row;
        return rest;
      });
    },
    setVisibleColumns(state, action: PayloadAction<string[]>) {
      state.visibleColumns = action.payload;
    },
    // NEW: Reorder columns
    reorderColumns(
      state,
      action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>
    ) {
      const { sourceIndex, destinationIndex } = action.payload;
      const newColumnOrder = Array.from(state.columnOrder);
      const [reorderedItem] = newColumnOrder.splice(sourceIndex, 1);
      newColumnOrder.splice(destinationIndex, 0, reorderedItem);
      state.columnOrder = newColumnOrder;
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

export const {
  setRows,
  addColumn,
  deleteColumn,
  setVisibleColumns,
  reorderColumns, // NEW: Export reorder action
  setSearch,
  setSort,
  setPage,
  setTheme,
  addRow,
  updateRow,
  deleteRow,
} = tableSlice.actions;

export const tableReducer = tableSlice.reducer;
