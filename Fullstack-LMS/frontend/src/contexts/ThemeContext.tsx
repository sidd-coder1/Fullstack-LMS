import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import '@mui/x-data-grid/themeAugmentation';

export type Mode = 'light' | 'dark';

interface ColorModeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

export const ColorModeContext = React.createContext<ColorModeContextValue>({ mode: 'light', toggleMode: () => {} });

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('themeMode') as Mode | null;
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = React.useState<Mode>(getInitialMode);

  const toggleMode = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  }, []);

  const theme = React.useMemo(() => createTheme({
    palette: {
      mode,
      // Soft Gray brand palette
      primary: { main: '#6b7280', light: '#9ca3af', dark: '#374151', contrastText: '#ffffff' },
      success: { main: '#16a34a', light: '#22c55e', dark: '#15803d', contrastText: '#ffffff' },
      warning: { main: '#f59e0b', light: '#fbbf24', dark: '#b45309', contrastText: mode === 'light' ? '#111827' : '#0b1020' },
      error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c', contrastText: '#ffffff' },
      info: { main: '#64748b', light: '#94a3b8', dark: '#475569', contrastText: '#ffffff' },
      background: mode === 'light'
        ? { default: '#fafafa', paper: '#ffffff' }
        : { default: '#0a0a0b', paper: '#111114' },
      text: mode === 'light'
        ? { primary: '#111827', secondary: '#6b7280' }
        : { primary: '#f9fafb', secondary: '#d1d5db' },
      grey: mode === 'light' ? {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      } : {
        50: '#1a1a1d',
        100: '#202023',
        200: '#2a2a2d',
        300: '#36363a',
        400: '#4a4a4f',
        500: '#6b6b70',
        600: '#8b8b90',
        700: '#a8a8ad',
        800: '#c4c4c9',
        900: '#e1e1e6',
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      body1: { fontWeight: 400 },
      body2: { fontWeight: 400 },
      button: { fontWeight: 600 },
    },
    components: {
      MuiToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: 56,
            [theme.breakpoints.up('sm')]: { minHeight: 64 },
          }),
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(2.5),
            '&:last-child': { paddingBottom: theme.spacing(2.5) },
            [theme.breakpoints.up('sm')]: {
              padding: theme.spacing(3),
              '&:last-child': { paddingBottom: theme.spacing(3) },
            },
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'transform 140ms ease, background-color 140ms ease, color 140ms ease, border-color 140ms ease',
          }),
          contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' }, '&:active': { transform: 'translateY(0)' } },
          outlined: { borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-1px)' }, '&:active': { transform: 'translateY(0)' } },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            boxShadow: theme.palette.mode === 'light'
              ? '0 6px 18px rgba(0,0,0,0.08)'
              : '0 6px 18px rgba(0,0,0,0.4)',
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[200]}` : 'none',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.mode === 'light'
                ? '0 10px 24px rgba(0,0,0,0.12)'
                : '0 10px 24px rgba(0,0,0,0.6)',
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 12px rgba(0,0,0,0.06)'
              : '0 4px 12px rgba(0,0,0,0.3)',
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[200]}` : 'none',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.palette.mode === 'light'
              ? '0 2px 10px rgba(0,0,0,0.06)'
              : '0 2px 10px rgba(0,0,0,0.4)',
            borderBottom: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[200]}` : 'none',
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            borderRight: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[200]}` : undefined,
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            '&.Mui-selected': { backgroundColor: theme.palette.action.selected, color: theme.palette.primary.main },
            '&:hover': { backgroundColor: theme.palette.action.hover },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[100] : 'transparent',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.mode === 'light' ? '#e5e7eb' : theme.palette.grey[300],
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.mode === 'light' ? '#9ca3af' : theme.palette.grey[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
            '& .MuiInputBase-input': {
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
            '&.Mui-focused': { color: theme.palette.primary.main },
            '&.MuiFormLabel-filled': { color: theme.palette.text.primary },
          }),
        },
      },
      MuiDataGrid: {
        defaultProps: { autoHeight: true },
        styleOverrides: {
          root: ({ theme }) => ({
            border: 0,
            borderRadius: 12,
            backgroundColor: theme.palette.background.paper,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.mode === 'light' ? '#f9fafb' : theme.palette.grey[100],
              color: theme.palette.text.primary,
              fontWeight: 600,
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-row': {
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? '#f3f4f6' : theme.palette.grey[200],
              },
            },
            '& .MuiDataGrid-cell': {
              color: theme.palette.text.primary,
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            '& .MuiDataGrid-selectedRowCount': { visibility: 'hidden' },
          }),
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[300]}` : 'none',
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 16,
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[200]}` : 'none',
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 12,
            border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey[200]}` : 'none',
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 12px rgba(0,0,0,0.1)'
              : '0 4px 12px rgba(0,0,0,0.4)',
          }),
        },
      },
    },
  }), [mode]);

  const value = React.useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => React.useContext(ColorModeContext);
