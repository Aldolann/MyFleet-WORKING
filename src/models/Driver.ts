export interface Driver {
  id: string;
  fleetId: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  license: {
    number: string;
    type: string;
    expiryDate: string;
    state: string;
    restrictions?: string[];
  };
  status: 'active' | 'inactive' | 'suspended';
  schedule: {
    regularHours?: {
      monday?: { start: string; end: string; };
      tuesday?: { start: string; end: string; };
      wednesday?: { start: string; end: string; };
      thursday?: { start: string; end: string; };
      friday?: { start: string; end: string; };
      saturday?: { start: string; end: string; };
      sunday?: { start: string; end: string; };
    };
    timeOff?: Array<{
      start: string;
      end: string;
      type: 'vacation' | 'sick' | 'personal';
      approved: boolean;
    }>;
  };
  performance: {
    rating: number;
    totalTrips: number;
    totalDistance: number;
    safetyScore: number;
    incidents?: Array<{
      date: string;
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  };
  documents: {
    driverLicense?: string;
    medicalCertificate?: string;
    trainingCertificates?: string[];
  };
  createdAt: string;
  updatedAt: string;
  ttl?: number;
}