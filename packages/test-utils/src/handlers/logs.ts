import { http, HttpResponse } from 'msw';

export const logsHandlers = [
  http.post('/api/logs', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
