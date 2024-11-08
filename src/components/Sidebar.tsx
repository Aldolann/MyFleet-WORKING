import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  FileText, 
  Settings,
  Users,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Vehicles', to: '/vehicles', icon: Car },
  { name: 'Drivers', to: '/drivers', icon: Users },
  { name: 'Schedule', to: '/schedule', icon: Calendar },
  { name: 'Reports', to: '/reports', icon: FileText },
  { name: 'Maintenance', to: '/maintenance', icon: AlertTriangle },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-gray-200 bg-white">
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}