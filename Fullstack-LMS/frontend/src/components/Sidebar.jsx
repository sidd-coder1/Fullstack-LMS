import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2,
  Monitor,
  Cpu,
  Grid,
  Wrench,
  Package,
  Sun,
  Moon,
} from 'lucide-react';
import { useColorMode } from '../contexts/ThemeContext';

const menuItems = [
  { name: 'Labs', icon: Building2, path: '/labs' },
  { name: 'PCs', icon: Monitor, path: '/pcs' },
  { name: 'Equipment', icon: Cpu, path: '/equipment' },
  { name: 'Software', icon: Grid, path: '/software' },
  { name: 'Maintenance', icon: Wrench, path: '/maintenance' },
  { name: 'Inventory', icon: Package, path: '/inventory' },
];

const Sidebar = () => {
  const location = useLocation();
  const { mode, toggleMode } = useColorMode();

  return (
    <aside
      className="peer group fixed left-0 top-14 z-40 h-[calc(100vh-56px)] w-16 hover:w-64 bg-[#1e1e1e] text-gray-200 border-r border-white/10 transition-all duration-300 ease-out"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Spacer (top padding) */}
        <div className="px-3 py-2" />

        {/* Middle: Navigation */}
        <nav className="mt-2 flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map(({ name, icon: Icon, path }) => {
              const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
              return (
                <li key={name}>
                  <NavLink
                    to={path}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 ${
                      active
                        ? 'bg-green-600 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span
                      className="opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out"
                    >
                      {name}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: Theme toggle */}
        <div className="mt-auto px-2 pb-3">
          <button
            onClick={toggleMode}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
            title="Toggle theme"
          >
            {mode === 'dark' ? (
              <Sun size={20} className="shrink-0" />
            ) : (
              <Moon size={20} className="shrink-0" />
            )}
            <span className="opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
