import { create } from 'zustand';
import type { Vehicle } from '../types';

interface VehicleState {
  vehicles: Vehicle[];
  setVehicles: (vehicles: Vehicle[]) => void;
  getVehicleStats: () => {
    total: number;
    available: number;
    maintenance: number;
  };
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  setVehicles: (vehicles) => set({ vehicles }),
  getVehicleStats: () => {
    const vehicles = get().vehicles;
    return {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === 'available').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    };
  },
}));