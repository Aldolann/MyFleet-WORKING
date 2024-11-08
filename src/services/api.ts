import { API } from 'aws-amplify';
import type { Driver, Vehicle, VehicleInspection } from '../types';

// Fleet Management
export const getFleet = async () => {
  return API.get('fleetApi', '/fleet', {});
};

// Vehicle Management
export const getVehicles = async () => {
  return API.get('fleetApi', '/vehicles', {});
};

export const createVehicle = async (vehicle: Partial<Vehicle>) => {
  return API.post('fleetApi', '/vehicles', { body: vehicle });
};

export const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>) => {
  return API.put('fleetApi', `/vehicles/${vehicleId}`, { body: updates });
};

// Driver Management
export const getDrivers = async () => {
  return API.get('fleetApi', '/drivers', {});
};

export const createDriver = async (driver: Partial<Driver>) => {
  return API.post('fleetApi', '/drivers', { body: driver });
};

export const updateDriver = async (driverId: string, updates: Partial<Driver>) => {
  return API.put('fleetApi', `/drivers/${driverId}`, { body: updates });
};

// Inspection Management
export const getInspections = async (vehicleId: string, date?: string) => {
  const queryParams = date ? `?vehicleId=${vehicleId}&date=${date}` : `?vehicleId=${vehicleId}`;
  return API.get('fleetApi', `/inspections${queryParams}`, {});
};

export const createInspection = async (inspection: Partial<VehicleInspection>) => {
  return API.post('fleetApi', '/inspections', { body: inspection });
};

// Error Handler
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  throw error;
};