import React from 'react';
import { Bell, Settings, User } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">FleetMaster Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <button className="flex items-center gap-2 rounded-full bg-gray-100 p-2 text-sm font-medium text-gray-700">
                <User className="h-6 w-6" />
                <span className="hidden md:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}