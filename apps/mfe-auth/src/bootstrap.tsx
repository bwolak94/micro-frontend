/**
 * Standalone development entry for mfe-auth.
 * In production this MFE is loaded via Module Federation by the shell.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import LoginPage from './LoginPage/LoginPage';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('[mfe-auth] Root DOM element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <LoginPage
        onLoginSuccess={(user) => {
          console.warn('[mfe-auth standalone] Login success:', user);
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
