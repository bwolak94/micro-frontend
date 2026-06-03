import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly icon: LucideIcon;
}

export interface SidebarProps {
  readonly isCollapsed?: boolean;
}
