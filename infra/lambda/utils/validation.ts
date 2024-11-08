import { z } from 'zod';

export const fleetSchema = z.object({
  name: z.string().min(1),
  adminId: z.string().min(1),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }).optional(),
  contact: z.object({
    phone: z.string(),
    email: z.string().email(),
  }).optional(),
});

export const vehicleSchema = z.object({
  plateNumber: z.string().min(1),
  vin: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  type: z.enum(['van', 'truck', 'car', 'other']),
  status: z.enum(['available', 'in-use', 'maintenance', 'retired']),
  mileage: z.object({
    current: z.number().min(0),
    lastService: z.number().min(0),
    nextServiceDue: z.number().min(0),
  }),
});

export const driverSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  license: z.object({
    number: z.string().min(1),
    type: z.string().min(1),
    expiryDate: z.string().min(1),
    state: z.string().min(1),
  }),
  status: z.enum(['active', 'inactive', 'suspended']),
});

export const inspectionSchema = z.object({
  vehicleId: z.string().min(1),
  type: z.enum(['pre-trip', 'post-trip', 'maintenance']),
  date: z.string().min(1),
  time: z.string().min(1),
  odometer: z.number().min(0),
  status: z.enum(['pass', 'fail', 'pending']),
  checklist: z.object({
    exterior: z.object({
      lights: z.boolean(),
      tires: z.boolean(),
      bodyDamage: z.boolean(),
      mirrors: z.boolean(),
      windows: z.boolean(),
      wipers: z.boolean(),
      licensePlate: z.boolean(),
    }),
    interior: z.object({
      seats: z.boolean(),
      seatbelts: z.boolean(),
      dashboard: z.boolean(),
      controls: z.boolean(),
      cleanliness: z.boolean(),
    }),
    mechanical: z.object({
      brakes: z.boolean(),
      steering: z.boolean(),
      engine: z.boolean(),
      transmission: z.boolean(),
      horn: z.boolean(),
      battery: z.boolean(),
    }),
    safety: z.object({
      firstAidKit: z.boolean(),
      fireExtinguisher: z.boolean(),
      emergencyKit: z.boolean(),
      reflectors: z.boolean(),
    }),
  }),
});