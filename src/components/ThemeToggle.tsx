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

  // Set mounted to true once the component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null until mounted to prevent SSR issues
  if (!mounted) return null;

  // Handle the theme toggle (light <-> dark)
  const handleToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={handleToggle}
      inputProps={{ 'aria-label': 'theme toggle' }}
    />
  );
};

export default ThemeToggle;
