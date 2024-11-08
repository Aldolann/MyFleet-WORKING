import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Car, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useVehicleStore } from '../store/vehicleStore';
import VehicleCard from '../components/vehicles/VehicleCard';
import DriverVehicleView from '../components/vehicles/DriverVehicleView';
import AddVehicleModal from '../components/vehicles/AddVehicleModal';
import type { Vehicle, VehicleInspection } from '../types';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'ABC-123',
    model: '2023 Ford Transit',
    vin: '1HGCM82633A123456',
    status: 'available',
    lastMaintenance: '2024-02-15',
    fleetId: 'fleet1',
  },
  {
    id: '2',
    plateNumber: 'XYZ-789',
    model: '2022 Mercedes Sprinter',
    vin: '2FMZA52234B789012',
    status: 'in-use',
    lastMaintenance: '2024-01-20',
    fleetId: 'fleet1',
  },
  {
    id: '3',
    plateNumber: 'DEF-456',
    model: '2023 RAM ProMaster',
    vin: '3VWFA71K86M345678',
    status: 'maintenance',
    lastMaintenance: '2024-03-01',
    fleetId: 'fleet1',
  },
];

export default function Vehicles() {
  const { user, fleet } = useAuthStore();
  const { translations: t } = useLanguageStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const setStoreVehicles = useVehicleStore(state => state.setVehicles);

  const currentFilter = searchParams.get('filter') || 'all';

  useEffect(() => {
    setStoreVehicles(vehicles);
  }, [vehicles, setStoreVehicles]);

  const handleStatusChange = (vehicleId: string, newStatus: Vehicle['status']) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
    ));
  };

  const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
    const newVehicle: Vehicle = {
      id: `v${Date.now()}`,
      plateNumber: vehicleData.plateNumber || '',
      model: vehicleData.model || '',
      vin: vehicleData.vin || '',
      status: 'available',
      lastMaintenance: new Date().toISOString().split('T')[0],
      fleetId: fleet?.id || '',
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddModal(false);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const handleInspectionSubmit = async (inspection: Partial<VehicleInspection>) => {
    // In production, this would send the data to your API
    console.log('Inspection submitted:', inspection);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        currentFilter === 'all' || 
        vehicle.status === currentFilter;

      return matchesSearch && matchesFilter;
    });
  }, [vehicles, searchQuery, currentFilter]);

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
  };

  // For drivers, show only their assigned vehicle
  if (user?.role === 'driver') {
    const assignedVehicle = vehicles.find(v => v.status === 'in-use');
    if (!assignedVehicle) {
      return (
        <div className="p-8 text-center text-gray-500">
          No vehicle assigned
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.vehicles}</h2>
        <DriverVehicleView
          vehicle={assignedVehicle}
          onInspectionSubmit={handleInspectionSubmit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.vehicles}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Managing vehicles for {fleet?.name}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {t.addVehicle}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={() => setSearchParams({})}
          className={`flex items-center justify-center gap-2 rounded-lg p-4 ${
            currentFilter === 'all' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Car className="h-5 w-5" />
          <div>
            <div className="text-2xl font-semibold">{stats.total}</div>
            <div className="text-sm">Total Vehicles</div>
          </div>
        </button>

        <button
          onClick={() => setSearchParams({ filter: 'available' })}
          className={`flex items-center justify-center gap-2 rounded-lg p-4 ${
            currentFilter === 'available' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <CheckCircle className="h-5 w-5" />
          <div>
            <div className="text-2xl font-semibold">{stats.available}</div>
            <div className="text-sm">Available</div>
          </div>
        </button>

        <button
          onClick={() => setSearchParams({ filter: 'maintenance' })}
          className={`flex items-center justify-center gap-2 rounded-lg p-4 ${
            currentFilter === 'maintenance' 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
          <div>
            <div className="text-2xl font-semibold">{stats.maintenance}</div>
            <div className="text-sm">In Maintenance</div>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by plate number, model, or VIN..."
          className="flex-1 border-none focus:ring-0 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteVehicle}
            isAdmin={user?.role === 'admin'}
          />
        ))}
        {filteredVehicles.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-8">
            No vehicles found matching your criteria
          </p>
        )}
      </div>

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVehicle}
      />
    </div>
  );
}