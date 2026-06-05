import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import DashboardPage from './DashboardPage/DashboardPage';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
});

const rootEl = document.getElementById('root');
if (rootEl === null) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
