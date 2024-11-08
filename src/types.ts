export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastMaintenance: string;
}