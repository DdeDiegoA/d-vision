import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@mui/material';
import { themeDark } from './lib/themes.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './lib/routes.tsx';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={themeDark}>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
);
