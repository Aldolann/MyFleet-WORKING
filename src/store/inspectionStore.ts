import { create } from 'zustand';
import type { VehicleInspection } from '../types';

interface InspectionState {
  inspections: Record<string, {
    date: string;
    vehicleId: string;
    vehicleModel: string;
    startOdometer?: number;
    endOdometer?: number;
    startInspection?: Partial<VehicleInspection>;
    endInspection?: Partial<VehicleInspection>;
  }>;
  addInspection: (inspection: Partial<VehicleInspection>) => void;
  getInspectionsByDate: (date: string) => any;
}

export const useInspectionStore = create<InspectionState>((set, get) => ({
  inspections: {},

  addInspection: (inspection) => {
    const date = new Date().toISOString().split('T')[0];
    
    set((state) => {
      const existingInspection = state.inspections[date] || {};
      
      return {
        inspections: {
          ...state.inspections,
          [date]: {
            ...existingInspection,
            date,
            vehicleId: inspection.vehicleId || '',
            vehicleModel: inspection.vehicleModel || '',
            ...(inspection.type === 'start' ? {
              startOdometer: inspection.odometer,
              startInspection: inspection,
            } : {
              endOdometer: inspection.odometer,
              endInspection: inspection,
            }),
          },
        },
      };
    });
  },

  getInspectionsByDate: (date: string) => {
    return get().inspections[date];
  },
}));