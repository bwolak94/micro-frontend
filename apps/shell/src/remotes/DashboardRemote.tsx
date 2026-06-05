import { lazy, Suspense, type FC } from 'react';

import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import MFEErrorBoundary from '../error-boundary/MFEErrorBoundary/MFEErrorBoundary';

const RemoteDashboardPage = lazy(() => import('mfeDashboard/DashboardPage'));

const DashboardPage: FC = () => (
  <MFEErrorBoundary name="mfe-dashboard">
    <Suspense fallback={<LoadingSpinner label="Loading dashboard..." />}>
      <RemoteDashboardPage />
    </Suspense>
  </MFEErrorBoundary>
);

const DashboardRemote = { DashboardPage } as const;

export default DashboardRemote;
