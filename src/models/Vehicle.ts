export interface Vehicle {
  id: string;
  fleetId: string;
  plateNumber: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: 'van' | 'truck' | 'car' | 'other';
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  mileage: {
    current: number;
    lastService: number;
    nextServiceDue: number;
  };
  maintenance: {
    lastServiceDate: string;
    nextServiceDate: string;
    serviceHistory: Array<{
      date: string;
      type: string;
      description: string;
      cost: number;
      provider: string;
    }>;
  };
  documents: {
    insurance: {
      provider: string;
      policyNumber: string;
      expiryDate: string;
    };
    registration: {
      number: string;
      expiryDate: string;
    };
  };
  assignedDriver?: string;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
  createdAt: string;
  updatedAt: string;
  ttl?: number;
}