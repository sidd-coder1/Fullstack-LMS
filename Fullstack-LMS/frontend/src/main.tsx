import React from 'react';
import '@mui/x-data-grid/themeAugmentation';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ColorModeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </React.StrictMode>
);
