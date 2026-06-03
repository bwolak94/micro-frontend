import { clsx } from 'clsx';
import { LayoutDashboard, Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import type { NavItem, SidebarProps } from './Sidebar.types';
import type { FC } from 'react';

const NAV_ITEMS: readonly NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
] as const;

const Sidebar: FC<SidebarProps> = ({ isCollapsed = false }) => (
  <aside
    aria-label="Application sidebar"
    className={clsx(
      'flex h-full flex-col bg-white shadow-md transition-all duration-300 dark:bg-gray-800',
      isCollapsed ? 'w-16' : 'w-64',
    )}
  >
    <div className="flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-700">
      {!isCollapsed && (
        <span className="text-lg font-bold text-gray-900 dark:text-white">MFE Portfolio</span>
      )}
    </div>
    <nav aria-label="Main navigation" className="flex-1 space-y-1 p-3">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          aria-label={label}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
            )
          }
        >
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!isCollapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
