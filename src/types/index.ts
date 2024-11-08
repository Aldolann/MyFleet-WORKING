export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  vin: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastMaintenance: string;
  fleetId: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'off-duty';
  assignedRoutes: string[];
  fleetId: string;
}

export interface Assignment {
  id: string;
  driverId: string;
  vehicleId: string;
  fleetId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Fleet {
  id: string;
  name: string;
  adminId: string;
  createdAt: string;
}

export interface DamageReport {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  type: 'damage' | 'inspection';
  status: 'pending' | 'resolved';
  location: string;
  severity: 'low' | 'medium' | 'high';
  aiAnalysis: {
    hasDamage: boolean;
    confidence: number;
    location?: string;
    severity?: 'low' | 'medium' | 'high';
    beforeImages?: string[];
    afterImages?: string[];
  };
  notes?: string;
  reportedBy: string;
}