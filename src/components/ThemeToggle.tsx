'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/tableSlice';
import { RootState } from '../redux/store';
import { Switch } from '@mui/material';

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.table.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
      inputProps={{ 'aria-label': 'theme toggle' }}
    />
  );
};

export default ThemeToggle;
