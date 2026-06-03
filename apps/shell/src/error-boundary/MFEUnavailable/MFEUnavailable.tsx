import { AlertTriangle } from 'lucide-react';

import type { MFEUnavailableProps } from './MFEUnavailable.types';
import type { FC } from 'react';

const MFEUnavailable: FC<MFEUnavailableProps> = ({ name, onRetry }) => (
  <div
    role="alert"
    aria-live="assertive"
    className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center"
  >
    <AlertTriangle className="h-10 w-10 text-red-400" aria-hidden="true" />
    <div>
      <h2 className="text-lg font-semibold text-red-800">{name} is unavailable</h2>
      <p className="mt-1 text-sm text-red-600">
        This module failed to load. Please check your connection and try again.
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Retry
      </button>
    )}
  </div>
);

export default MFEUnavailable;
