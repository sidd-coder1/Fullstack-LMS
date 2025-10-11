import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const HeaderBar = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#1e1e1e] border-b border-white/10">
      <div className="mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="YBIT" className="h-9 w-9 rounded-sm object-contain" />
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate">
            Yashwantrao Bhonsale Institute Of Technology
          </h1>
        </div>

        {/* Right nav: Dashboard + Settings + Account/Login (large screens) */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-2 text-sm">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Settings size={16} />
                <span>Settings</span>
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li>
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                      isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                  title={user?.username || 'Account'}
                >
                  <User size={16} />
                  <span>{user?.username || 'Account'}</span>
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition-colors ${
                      isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
;

export default HeaderBar;
