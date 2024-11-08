export interface Inspection {
  id: string;
  vehicleId: string;
  fleetId: string;
  driverId: string;
  type: 'pre-trip' | 'post-trip' | 'maintenance';
  date: string;
  time: string;
  odometer: number;
  status: 'pass' | 'fail' | 'pending';
  checklist: {
    exterior: {
      lights: boolean;
      tires: boolean;
      bodyDamage: boolean;
      mirrors: boolean;
      windows: boolean;
      wipers: boolean;
      licensePlate: boolean;
    };
    interior: {
      seats: boolean;
      seatbelts: boolean;
      dashboard: boolean;
      controls: boolean;
      cleanliness: boolean;
    };
    mechanical: {
      brakes: boolean;
      steering: boolean;
      engine: boolean;
      transmission: boolean;
      horn: boolean;
      battery: boolean;
    };
    safety: {
      firstAidKit: boolean;
      fireExtinguisher: boolean;
      emergencyKit: boolean;
      reflectors: boolean;
    };
  };
  photos: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
    interior?: string;
    damage?: string[];
  };
  notes?: string;
  issues?: Array<{
    category: 'safety' | 'mechanical' | 'cosmetic';
    severity: 'low' | 'medium' | 'high';
    description: string;
    photos?: string[];
    resolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
  }>;
  signature?: {
    driver: string;
    supervisor?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  weather?: {
    condition: string;
    temperature: number;
    precipitation: boolean;
  };
  createdAt: string;
  updatedAt: string;
  ttl?: number;
}