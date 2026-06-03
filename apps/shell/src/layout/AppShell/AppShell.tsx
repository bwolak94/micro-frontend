import { useState, type FC } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';

import type { AppShellProps } from './AppShell.types';

const AppShell: FC<AppShellProps> = ({ defaultCollapsed = false }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} />
        <main id="main-content" className="flex-1 overflow-auto p-6" aria-label="Main content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
