/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addColumn,
  setVisibleColumns,
  deleteColumn,
} from '../redux/tableSlice';
import {
  Modal,
  Checkbox,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface FormData {
  newField: string;
  newLabel: string;
}

const ManageColumnsModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { columns, visibleColumns, columnOrder } = useSelector(
    (state: RootState) => state.table
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      newField: '',
      newLabel: '',
    },
  });

  const onSubmit = (data: FormData) => {
    // Check if field already exists
    if (columns.some((col) => col.field === data.newField)) {
      alert('Field name already exists!');
      return;
    }

    dispatch(
      addColumn({
        field: data.newField,
        label: data.newLabel,
        type: 'string',
        editable: true,
      })
    );
    reset();
    alert('Column added successfully!');
  };

  const handleToggle = (field: string) => {
    const updated = visibleColumns.includes(field)
      ? visibleColumns.filter((f) => f !== field)
      : [...visibleColumns, field];
    dispatch(setVisibleColumns(updated));
  };

  const handleDeleteColumn = (field: string) => {
    // Prevent deletion of core columns
    const coreColumns = ['name', 'email', 'age', 'role'];
    if (coreColumns.includes(field)) {
      <Typography>
        Cannot delete core columns (&quot;Name, Email, Age, Role&quot;)
      </Typography>;
      return;
    }

    if (
      window.confirm(`Are you sure you want to delete the "${field}" column?`)
    ) {
      dispatch(deleteColumn(field));
    }
  };

  // Order columns based on columnOrder
  const orderedColumns = columnOrder
    .map((fieldName) => columns.find((col) => col.field === fieldName))
    .filter((col): col is NonNullable<typeof col> => col !== undefined);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          minWidth: 400,
          maxWidth: 500,
          mx: 'auto',
          mt: '10vh',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          🔧 Manage Columns
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Column Visibility & Order
        </Typography>

        <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            💡 Current column order (as they appear in table):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {orderedColumns.map((col, index) => (
              <Chip
                key={col.field}
                label={`${index + 1}. ${col.label}`}
                size="small"
                variant={
                  visibleColumns.includes(col.field) ? 'filled' : 'outlined'
                }
                icon={<DragIndicatorIcon />}
              />
            ))}
          </Box>
        </Box>

        {orderedColumns.map((col) => (
          <Box
            key={col.field}
            sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
          >
            <Checkbox
              checked={visibleColumns.includes(col.field)}
              onChange={() => handleToggle(col.field)}
            />
            <Typography sx={{ flexGrow: 1 }}>{col.label}</Typography>
            {!['name', 'email', 'age', 'role'].includes(col.field) && (
              <IconButton
                onClick={() => handleDeleteColumn(col.field)}
                size="small"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Column
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <Controller
              name="newField"
              control={control}
              rules={{
                required: 'Field name is required',
                pattern: {
                  value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                  message:
                    'Field must start with letter, only letters, numbers, and underscores allowed',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Field Name (e.g., department)"
                  fullWidth
                  size="small"
                  error={!!errors.newField}
                  helperText={
                    errors.newField
                      ? errors.newField.message
                      : 'Used internally for data storage'
                  }
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Controller
              name="newLabel"
              control={control}
              rules={{ required: 'Display label is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Display Label (e.g., Department)"
                  fullWidth
                  size="small"
                  error={!!errors.newLabel}
                  helperText={
                    errors.newLabel
                      ? errors.newLabel.message
                      : 'Shown in table header'
                  }
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" fullWidth>
              ➕ Add Column
            </Button>
            <Button onClick={onClose} variant="outlined" fullWidth>
              Close
            </Button>
          </Box>
        </form>

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'info.main',
            color: 'info.contrastText',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            🧭 <strong>Pro Tip:</strong> Use the "Show Column Reorder" button in
            the main table to drag and drop columns into your preferred order!
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ManageColumnsModal;
