import { setupServer } from 'msw/node';

import { authHandlers } from './handlers/auth';
import { dashboardHandlers } from './handlers/dashboard';
import { logsHandlers } from './handlers/logs';
import { productsHandlers } from './handlers/products';

export const allHandlers = [
  ...authHandlers,
  ...productsHandlers,
  ...dashboardHandlers,
  ...logsHandlers,
];

export const server = setupServer(...allHandlers);
