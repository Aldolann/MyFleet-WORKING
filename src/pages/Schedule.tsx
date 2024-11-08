import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useDriverStore } from '../store/driverStore';
import AssignmentList from '../components/schedule/AssignmentList';
import BulkAssignmentForm from '../components/schedule/BulkAssignmentForm';
import type { Assignment, Vehicle } from '../types';

// Mock data - In production, this would come from your API
const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    plateNumber: 'ABC-123',
    model: '2023 Ford Transit',
    vin: '1HGCM82633A123456',
    status: 'available',
    lastMaintenance: '2024-02-15',
    fleetId: 'fleet1'
  },
  {
    id: 'v2',
    plateNumber: 'XYZ-789',
    model: '2022 Mercedes Sprinter',
    vin: '2FMZA52234B789012',
    status: 'available',
    lastMaintenance: '2024-01-20',
    fleetId: 'fleet1'
  },
  {
    id: 'v3',
    plateNumber: 'DEF-456',
    model: '2023 RAM ProMaster',
    vin: '3VWFA71K86M345678',
    status: 'available',
    lastMaintenance: '2024-03-01',
    fleetId: 'fleet1'
  }
];

export default function Schedule() {
  const { user } = useAuthStore();
  const { translations: t } = useLanguageStore();
  const { getActiveDrivers } = useDriverStore();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const handleBulkAssignment = async (
    date: string,
    selectedDrivers: string[],
    startTime: string,
    endTime: string
  ) => {
    const availableVehicles = mockVehicles.filter(v => v.status === 'available');
    const newAssignments = selectedDrivers.map((driverId, index) => ({
      id: `a${Date.now()}_${index}`,
      driverId,
      vehicleId: availableVehicles[index]?.id || '',
      fleetId: user?.fleetId || '',
      date,
      startTime,
      endTime,
      status: 'pending' as const
    }));

    setAssignments([...assignments, ...newAssignments]);
  };

  const handleAssignmentUpdate = (
    assignmentId: string,
    updates: Partial<Assignment>
  ) => {
    setAssignments(current =>
      current.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, ...updates }
          : assignment
      )
    );
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    setAssignments(current =>
      current.filter(assignment => assignment.id !== assignmentId)
    );
  };

  if (user?.role !== 'admin') {
    return null;
  }

  const availableDrivers = getActiveDrivers();

  const availableVehicles = mockVehicles.filter(vehicle =>
    !assignments.some(a => 
      a.date === selectedDate && a.vehicleId === vehicle.id
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.schedule}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {t.manageAssignments}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BulkAssignmentForm
          onSubmit={handleBulkAssignment}
          drivers={availableDrivers}
          availableVehicles={availableVehicles}
        />

        <AssignmentList
          assignments={assignments}
          drivers={availableDrivers}
          vehicles={mockVehicles}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onAssignmentUpdate={handleAssignmentUpdate}
          onRemoveAssignment={handleRemoveAssignment}
        />
      </div>
    </div>
  );
}