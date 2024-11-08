import React from 'react';
import { Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useInspectionStore } from '../store/inspectionStore';
import { useVehicleStore } from '../store/vehicleStore';
import WorkCalendar from '../components/calendar/WorkCalendar';
import QRCode from 'qrcode.react';

// Mock vehicle assignment for driver
const MOCK_VEHICLE_ASSIGNMENT = {
  vehicleId: 'ABC-123',
  vehicleModel: '2023 Ford Transit',
  vin: '1HGCM82633A123456',
  status: 'in-use'
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { translations: t } = useLanguageStore();
  const navigate = useNavigate();
  const inspections = useInspectionStore(state => state.inspections);
  const vehicleStats = useVehicleStore(state => state.getVehicleStats());

  // Get today's inspection data
  const today = new Date().toISOString().split('T')[0];
  const todayInspection = inspections[today];

  // For driver view
  if (user?.role === 'driver') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t.driverDashboard}</h2>
          <div className="text-sm text-gray-500">
            {t.lastUpdated}: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Current Assignment */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Today's Assignment</h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{MOCK_VEHICLE_ASSIGNMENT.vehicleId}</p>
                <p className="text-sm text-gray-500">{MOCK_VEHICLE_ASSIGNMENT.vehicleModel}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCode value={MOCK_VEHICLE_ASSIGNMENT.vin} size={64} />
              </div>
              <button
                onClick={() => navigate('/vehicles')}
                className="rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                View Vehicle Details
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <WorkCalendar />
      </div>
    );
  }

  // For admin view
  const adminStats = [
    { 
      title: t.totalVehicles, 
      value: vehicleStats.total.toString(), 
      icon: Car, 
      color: 'bg-blue-500',
      onClick: () => navigate('/vehicles')
    },
    { 
      title: t.availableVehicles, 
      value: vehicleStats.available.toString(), 
      icon: Car, 
      color: 'bg-green-500',
      onClick: () => navigate('/vehicles?filter=available')
    },
    { 
      title: t.inMaintenance, 
      value: vehicleStats.maintenance.toString(), 
      icon: Car, 
      color: 'bg-yellow-500',
      onClick: () => navigate('/vehicles?filter=maintenance')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t.fleetOverview}</h2>
        <div className="text-sm text-gray-500">
          {t.lastUpdated}: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <div className="absolute right-0 top-0 h-24 w-24 transform translate-x-8 -translate-y-8">
                <div className={`absolute inset-0 ${stat.color} opacity-10 rounded-full`} />
              </div>
              <div className="relative">
                <Icon className={`h-8 w-8 ${stat.color} text-white rounded-lg p-1`} />
                <p className="mt-4 text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}