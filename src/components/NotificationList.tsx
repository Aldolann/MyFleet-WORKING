import React from 'react';
import { Bell, Car, Wrench, AlertTriangle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'damage',
    message: 'New damage report for vehicle ABC-123',
    time: '2 hours ago',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-100',
  },
  {
    id: 2,
    type: 'inspection',
    message: 'Vehicle XYZ-789 inspection completed',
    time: '4 hours ago',
    icon: Car,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 3,
    type: 'maintenance',
    message: 'Maintenance due for vehicle DEF-456',
    time: '1 day ago',
    icon: Wrench,
    color: 'text-yellow-600 bg-yellow-100',
  },
];

export default function NotificationList() {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <Bell className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Recent Notifications</span>
        </span>
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600">
          3
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className="flex items-start space-x-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div className={`rounded-full p-1 ${notification.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}