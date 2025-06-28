'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { RootState } from '../redux/store'; // Ensure RootState is correctly imported

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the theme mode from Redux, defaulting to 'light' if undefined
  const mode: 'light' | 'dark' =
    useSelector((state: RootState) => state.table.theme) || 'light';

  // Memoize the theme to avoid unnecessary recalculations
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode] // Recreate theme only when 'mode' changes
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
