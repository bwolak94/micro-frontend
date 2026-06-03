import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import AuthProvider from './providers/AuthProvider/AuthProvider';
import QueryProvider from './providers/QueryProvider/QueryProvider';
import ThemeProvider from './providers/ThemeProvider/ThemeProvider';
import { router } from './router';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('[shell] Root DOM element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
