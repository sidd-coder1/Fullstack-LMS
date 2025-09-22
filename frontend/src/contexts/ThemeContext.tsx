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
      primary: { main: '#1d4ed8', light: '#3b82f6', dark: '#1e40af', contrastText: '#ffffff' },
      success: { main: '#16a34a', light: '#22c55e', dark: '#15803d', contrastText: '#ffffff' },
      warning: { main: '#f59e0b', light: '#fbbf24', dark: '#b45309', contrastText: mode === 'light' ? '#111827' : '#0b1020' },
      error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c', contrastText: '#ffffff' },
      info: { main: '#0ea5e9', light: '#38bdf8', dark: '#0284c7', contrastText: '#ffffff' },
      background: mode === 'light'
        ? { default: '#ffffff', paper: '#ffffff' }
        : { default: '#0b1020', paper: '#0f172a' },
      text: mode === 'light'
        ? { primary: '#111827', secondary: '#6b7280' }
        : { primary: '#e5e7eb', secondary: '#9ca3af' },
      grey: {
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
          root: { borderRadius: 16, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(0,0,0,0.12)' } },
        },
      },
      MuiPaper: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } } },
      MuiAppBar: { styleOverrides: { root: ({ theme }) => ({ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }) } },
      MuiDrawer: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: theme.palette.background.paper }) } },
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
            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'light' ? '#e5e7eb' : '#334155' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.mode === 'light' ? '#9ca3af' : '#475569' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth: 2 },
          }),
        },
      },
      MuiInputLabel: { styleOverrides: { root: ({ theme }) => ({ color: theme.palette.text.secondary, '&.Mui-focused': { color: theme.palette.primary.main } }) } },
      MuiDataGrid: {
        defaultProps: { autoHeight: true },
        styleOverrides: {
          root: ({ theme }) => ({
            border: 0,
            '& .MuiDataGrid-columnHeaders': { backgroundColor: theme.palette.mode === 'light' ? '#f9fafb' : '#111827', color: theme.palette.text.primary, fontWeight: 600 },
            '& .MuiDataGrid-row:hover': { backgroundColor: theme.palette.mode === 'light' ? '#f3f4f6' : '#0b1220' },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            '& .MuiDataGrid-selectedRowCount': { visibility: 'hidden' },
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
