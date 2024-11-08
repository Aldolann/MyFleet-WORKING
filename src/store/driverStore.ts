import { create } from 'zustand';
import type { Driver } from '../types';

interface DriverState {
  drivers: Driver[];
  setDrivers: (drivers: Driver[]) => void;
  addDriver: (driver: Driver) => void;
  removeDriver: (id: string) => void;
  updateDriverStatus: (id: string, status: Driver['status']) => void;
  getActiveDrivers: () => Driver[];
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [
    {
      id: 'driver1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      assignedRoutes: [],
      fleetId: 'fleet1'
    },
    {
      id: 'driver2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active',
      assignedRoutes: [],
      fleetId: 'fleet1'
    },
    {
      id: 'driver3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'active',
      assignedRoutes: [],
      fleetId: 'fleet1'
    }
  ],
  setDrivers: (drivers) => set({ drivers }),
  addDriver: (driver) => set((state) => ({ 
    drivers: [...state.drivers, driver] 
  })),
  removeDriver: (id) => set((state) => ({
    drivers: state.drivers.filter(d => d.id !== id)
  })),
  updateDriverStatus: (id, status) => set((state) => ({
    drivers: state.drivers.map(driver => 
      driver.id === id ? { ...driver, status } : driver
    )
  })),
  getActiveDrivers: () => get().drivers.filter(d => d.status === 'active'),
}));