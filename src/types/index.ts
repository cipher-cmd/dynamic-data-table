export interface TableRow {
  [key: string]: string | number;
}

export interface TableColumn {
  field: string;
  label: string;
  type: 'string' | 'number';
  editable: boolean;
}
