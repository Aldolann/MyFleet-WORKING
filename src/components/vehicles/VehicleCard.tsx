import React, { useState } from 'react';
import { Car, Wrench, QrCode, Trash2, Fuel } from 'lucide-react';
import QRCode from 'qrcode.react';
import VehicleFuelHistory from './VehicleFuelHistory';
import type { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onStatusChange: (id: string, status: Vehicle['status']) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function VehicleCard({ vehicle, onStatusChange, onDelete, isAdmin }: VehicleCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFuelHistory, setShowFuelHistory] = useState(false);

  const statusColors = {
    'available': 'bg-green-100 text-green-800',
    'in-use': 'bg-yellow-100 text-yellow-800',
    'maintenance': 'bg-red-100 text-red-800',
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(vehicle.id);
  };

  return (
    <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500">
      <div className="flex items-center justify-between">
        <Car className="h-8 w-8 text-blue-500" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFuelHistory(true)}
            className="p-1 text-gray-400 hover:text-green-600"
            title="View Fuel History"
          >
            <Fuel className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Show QR Code"
          >
            <QrCode className="h-5 w-5" />
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete Vehicle"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusColors[vehicle.status]
            }`}
          >
            {vehicle.status}
          </span>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {vehicle.plateNumber}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{vehicle.model}</p>
      <p className="mt-1 text-xs text-gray-400">VIN: {vehicle.vin}</p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Wrench className="mr-1.5 h-4 w-4" />
          Last maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onStatusChange(vehicle.id, 'available')}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
              vehicle.status === 'available'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => onStatusChange(vehicle.id, 'in-use')}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
              vehicle.status === 'in-use'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
            }`}
          >
            In Use
          </button>
          <button
            onClick={() => onStatusChange(vehicle.id, 'maintenance')}
            className={`flex-1 rounded-md px-2 py-1 text-xs font-medium ${
              vehicle.status === 'maintenance'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50'
            }`}
          >
            Maintenance
          </button>
        </div>
      )}

      {showQR && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center">
            <QRCode value={vehicle.vin} size={150} />
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Delete Vehicle?</h4>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete {vehicle.plateNumber}? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showFuelHistory && (
        <VehicleFuelHistory
          vehicle={vehicle}
          isOpen={showFuelHistory}
          onClose={() => setShowFuelHistory(false)}
        />
      )}
    </div>
  );
}