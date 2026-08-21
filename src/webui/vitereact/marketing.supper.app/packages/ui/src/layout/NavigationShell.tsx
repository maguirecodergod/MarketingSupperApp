import * as React from 'react';
import { Button } from '../components/Button.js';
import { Badge } from '../components/Input.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import { LanguageSelector } from '../components/LanguageSelector.js';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: string;
}

export interface NavigationShellProps {
  appName?: string;
  headerTitle?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  navItems: NavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  signOutLabel?: string;
  statusLabel?: string;
  children: React.ReactNode;
}

export function NavigationShell({
  appName = 'Enterprise Admin',
  headerTitle = 'Enterprise Administration',
  userName = 'Admin User',
  userEmail = 'admin@enterprise.internal',
  userRole = 'Administrator',
  navItems,
  onNavigate,
  onLogout,
  signOutLabel = 'Sign out',
  statusLabel = 'System Online',
  children,
}: NavigationShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-200 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                E
              </div>
              <span className="font-semibold text-gray-900 dark:text-white truncate">{appName}</span>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              E
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left ${
                item.active
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {sidebarOpen && <span className="truncate flex-1">{item.label}</span>}
              {sidebarOpen && item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <Badge variant="outline" className="text-[10px]">
                  {userRole}
                </Badge>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="h-7 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    {signOutLabel}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={onLogout}
                title={signOutLabel}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
              >
                ⎋
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{headerTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            <Badge variant="success" className="text-xs">
              {statusLabel}
            </Badge>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/70 dark:bg-gray-950">{children}</main>
      </div>
    </div>
  );
}
