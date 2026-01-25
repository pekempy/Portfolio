import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { theme } from './theme';
import { ContentProvider } from './context/ContentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ContentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContentProvider>
    </MantineProvider>
  </React.StrictMode>,
);
