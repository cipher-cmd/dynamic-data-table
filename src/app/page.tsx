'use client';
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import ManageColumnsModal from '../components/ManageColumnsModal';
import ImportExportControls from '../components/ImportExportControls';
import ThemeToggle from '../components/ThemeToggle';
import { Container, Button, Box, Typography, Paper, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setRows } from '../redux/tableSlice';
import { RootState } from '../redux/store';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { rows, visibleColumns } = useSelector(
    (state: RootState) => state.table
  );

  const addSampleData = () => {
    const sampleData = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 28,
        role: 'Developer',
        department: 'Engineering',
        location: 'New York',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 32,
        role: 'Designer',
        department: 'Design',
        location: 'San Francisco',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        age: 45,
        role: 'Manager',
        department: 'Operations',
        location: 'Chicago',
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        age: 29,
        role: 'Developer',
        department: 'Engineering',
        location: 'Austin',
      },
      {
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        age: 35,
        role: 'Analyst',
        department: 'Finance',
        location: 'Boston',
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        age: 31,
        role: 'Designer',
        department: 'Design',
        location: 'Los Angeles',
      },
      {
        name: 'Frank Miller',
        email: 'frank@example.com',
        age: 38,
        role: 'Developer',
        department: 'Engineering',
        location: 'Seattle',
      },
      {
        name: 'Grace Lee',
        email: 'grace@example.com',
        age: 27,
        role: 'Marketing',
        department: 'Marketing',
        location: 'Miami',
      },
    ];
    dispatch(setRows(sampleData));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              🚀 Dynamic Data Table Manager
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your data with sorting, filtering, editing, and more!
            </Typography>
          </Box>
          <ThemeToggle />
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`${rows.length} Total Rows`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`${visibleColumns.length} Visible Columns`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Controls */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <ImportExportControls />
          <Button
            variant="outlined"
            onClick={() => setModalOpen(true)}
            sx={{ minWidth: 140 }}
          >
            🔧 Manage Columns
          </Button>
          <Button variant="text" onClick={addSampleData} sx={{ minWidth: 140 }}>
            📊 Load Sample Data
          </Button>
        </Box>
      </Paper>

      {/* Data Table */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <DataTable />
      </Paper>

      {/* Modal */}
      <ManageColumnsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Built with Next.js, Redux Toolkit, Material-UI & TypeScript ⚡
        </Typography>
      </Box>
    </Container>
  );
}
