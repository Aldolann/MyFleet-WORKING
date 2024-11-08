import { create } from 'zustand';
import type { Admin, Driver, Fleet } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver';
  fleetId: string;
}

interface AuthState {
  user: User | null;
  fleet: Fleet | null;
  drivers: Driver[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addDriver: (driver: Driver) => void;
  registerDriver: (token: string, password: string) => Promise<void>;
  inviteAdmin: (email: string) => Promise<string>;
  registerAdmin: (token: string, password: string) => Promise<void>;
  createFirstAdmin: (data: {
    name: string;
    email: string;
    password: string;
    fleetName: string;
    phone: string;
  }) => Promise<void>;
}

// Mock data storage - In production, this would be in DynamoDB
const MOCK_FLEETS: Record<string, Fleet> = {
  'fleet1': {
    id: 'fleet1',
    name: 'City Express Fleet',
    adminId: 'admin1',
    createdAt: '2024-01-01',
  }
};

const MOCK_USERS: Record<string, (Admin | Driver) & { password: string }> = {
  'admin@fleet.com': {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@fleet.com',
    role: 'admin' as const,
    fleetId: 'fleet1',
    password: 'admin123',
  },
  'driver@fleet.com': {
    id: 'driver1',
    name: 'Driver User',
    email: 'driver@fleet.com',
    role: 'driver' as const,
    fleetId: 'fleet1',
    password: 'driver123',
    status: 'active',
    assignedRoutes: [],
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  fleet: null,
  drivers: [],

  login: async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email];
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...user } = mockUser;
    const fleet = MOCK_FLEETS[user.fleetId];
    
    set({ user, fleet });
  },

  logout: () => set({ user: null, fleet: null }),

  addDriver: (driver: Driver) => {
    set((state) => ({
      drivers: [...state.drivers, driver]
    }));
  },

  registerDriver: async (token: string, password: string) => {
    // In production, this would validate the token and create the user in Cognito
    if (!token.startsWith('driver_')) {
      throw new Error('Invalid registration token');
    }
  },

  inviteAdmin: async (email: string) => {
    const { fleet } = get();
    if (!fleet) throw new Error('No fleet selected');

    // Generate invite token
    const token = `admin_${Math.random().toString(36).substr(2, 9)}`;
    
    // In production, this would:
    // 1. Store the token in DynamoDB with an expiration
    // 2. Send an email via SES with the registration link
    
    return token;
  },

  registerAdmin: async (token: string, password: string) => {
    // In production, this would validate the token and create the admin in Cognito
    if (!token.startsWith('admin_')) {
      throw new Error('Invalid registration token');
    }
  },

  createFirstAdmin: async (data) => {
    // Check if email already exists
    if (MOCK_USERS[data.email]) {
      throw new Error('Email already registered');
    }

    // Generate unique IDs
    const fleetId = `fleet_${Date.now()}`;
    const adminId = `admin_${Date.now()}`;

    // Create new fleet
    MOCK_FLEETS[fleetId] = {
      id: fleetId,
      name: data.fleetName,
      adminId,
      createdAt: new Date().toISOString(),
    };

    // Create admin user
    MOCK_USERS[data.email] = {
      id: adminId,
      name: data.name,
      email: data.email,
      role: 'admin',
      fleetId,
      password: data.password,
    };

    // In production, this would:
    // 1. Create the fleet in DynamoDB
    // 2. Create the admin user in Cognito
    // 3. Set up initial fleet settings
    // 4. Create necessary DynamoDB tables
    // 5. Set up S3 buckets for fleet photos
  },
}));