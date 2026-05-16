import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Sun, Moon, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary dark:bg-surface-dark">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-white dark:bg-surface-dark-secondary border-r border-slate-100 dark:border-slate-700/60">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/30">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-700 text-slate-900 dark:text-white tracking-tight">
              SmartLeads
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Users size={16} />
            Leads
          </NavLink>
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-xs font-medium text-slate-900 dark:text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{user?.email}</p>
            <span className="mt-1 inline-block text-xs font-medium px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
