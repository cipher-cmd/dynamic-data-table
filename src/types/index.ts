// Define the type for a row in the table
export interface TableRow {
  [key: string]: string | number | undefined; // Allow 'undefined' if a key might be missing
}

// Define the type for a column in the table
export interface TableColumn {
  field: string; // Unique identifier for the column (e.g., 'name', 'email', etc.)
  label: string; // Display name for the column (e.g., 'Name', 'Email')
  type: 'string' | 'number'; // Column data type (expandable in the future, e.g., 'boolean' or 'date')
  editable: boolean; // Whether the column is editable or not
}
