'use client';
import { TableRow } from '../types';
import React, { useState } from 'react';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { setRows } from '../redux/tableSlice';
import { RootState } from '../redux/store';
import { Button, Alert, CircularProgress, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';

const ImportExportControls: React.FC = () => {
  const dispatch = useDispatch();
  const { rows, columns, visibleColumns } = useSelector(
    (state: RootState) => state.table
  );

  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setSuccess(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            throw new Error(
              `CSV parsing errors: ${results.errors
                .map((e) => e.message)
                .join(', ')}`
            );
          }

          if (!results.data || results.data.length === 0) {
            throw new Error('No data found in CSV file');
          }

          // Validate that required columns exist
          const requiredColumns = ['name', 'email', 'age', 'role'];
          const csvColumns = Object.keys(
            results.data[0] as Record<string, unknown>
          );

          const missingColumns = requiredColumns.filter(
            (col) => !csvColumns.includes(col)
          );

          if (missingColumns.length > 0) {
            throw new Error(
              `Missing required columns: ${missingColumns.join(', ')}`
            );
          }

          dispatch(setRows(results.data as TableRow[]));
          setSuccess(`Successfully imported ${results.data.length} rows`);

          // Clear the file input
          e.target.value = '';
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Unknown error occurred'
          );
        } finally {
          setImporting(false);
        }
      },
      error: (err) => {
        setError(`File reading error: ${err.message}`);
        setImporting(false);
      },
    });
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      setSuccess(null);

      if (rows.length === 0) {
        throw new Error('No data to export');
      }

      // Get visible columns info
      const visibleColumnsInfo = columns.filter((col) =>
        visibleColumns.includes(col.field)
      );

      // Prepare export data with only visible columns
      const exportData = rows.map((row) =>
        visibleColumnsInfo.reduce((acc, col) => {
          acc[col.label] = row[col.field] || '';
          return acc;
        }, {} as Record<string, unknown>)
      );

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `table_export_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(
        `Successfully exported ${rows.length} rows with ${visibleColumns.length} columns`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  // Auto-clear messages after 5 seconds
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          disabled={importing}
          startIcon={
            importing ? <CircularProgress size={16} /> : <CloudUploadIcon />
          }
        >
          {importing ? 'Importing...' : 'Import CSV'}
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleImport}
            disabled={importing}
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleExport}
          disabled={exporting || rows.length === 0}
          startIcon={
            exporting ? <CircularProgress size={16} /> : <DownloadIcon />
          }
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default ImportExportControls;
