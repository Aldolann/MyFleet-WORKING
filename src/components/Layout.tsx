import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import LanguageToggle from './LanguageToggle';
import { 
  LayoutDashboard,
  Settings,
  LogOut,
  Car,
  Users,
  Calendar,
  FileText,
  Wrench
} from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { translations: t } = useLanguageStore();
  
  const driverNavigation = [
    { name: t.dashboard, href: '/', icon: LayoutDashboard },
    { name: t.settings, href: '/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: t.dashboard, href: '/', icon: LayoutDashboard },
    { name: t.vehicles, href: '/vehicles', icon: Car },
    { name: t.drivers, href: '/drivers', icon: Users },
    { name: t.schedule, href: '/schedule', icon: Calendar },
    { name: t.reports, href: '/reports', icon: FileText },
    { name: t.maintenance, href: '/maintenance', icon: Wrench },
    { name: t.settings, href: '/settings', icon: Settings },
  ];

  const navigation = user?.role === 'admin' ? adminNavigation : driverNavigation;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 bg-white shadow-lg lg:block">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-gray-900">Fleet Manager</h1>
          </div>
          
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <LanguageToggle />
            </div>
          </div>

          <nav className="mt-4 space-y-1 px-3 py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              {t.logout}
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 p-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
          <nav className="grid grid-cols-5 divide-x divide-gray-200">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span className="truncate">{t.logout}</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}