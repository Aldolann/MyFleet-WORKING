import React from 'react';
import { Car, Wrench, Camera } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (id: string) => void;
  isAdmin: boolean;
}

export default function VehicleCard({ vehicle, onViewDetails, isAdmin }: VehicleCardProps) {
  return (
    <div className="relative rounded-lg border border-gray-200 p-6 hover:border-blue-500">
      <div className="flex items-center justify-between">
        <Car className="h-8 w-8 text-blue-500" />
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            vehicle.status === 'available'
              ? 'bg-green-100 text-green-800'
              : vehicle.status === 'maintenance'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {vehicle.status}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {vehicle.plateNumber}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{vehicle.model}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Wrench className="mr-1.5 h-4 w-4" />
          Last maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
        </div>
        <button 
          onClick={() => onViewDetails(vehicle.id)}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          {isAdmin ? (
            <>View Details</>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Start Inspection
            </>
          )}
        </button>
      </div>
    </div>
  );
}