import React, { useState } from 'react';
import { Clock, Users, Car, AlertCircle } from 'lucide-react';
import type { Assignment, Driver, Vehicle } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

interface AssignmentListProps {
  assignments: Assignment[];
  drivers: Driver[];
  vehicles: Vehicle[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAssignmentUpdate: (assignmentId: string, updates: Partial<Assignment>) => void;
  onRemoveAssignment: (assignmentId: string) => void;
}

export default function AssignmentList({
  assignments,
  drivers,
  vehicles,
  selectedDate,
  onDateChange,
  onAssignmentUpdate,
  onRemoveAssignment,
}: AssignmentListProps) {
  const { translations: t } = useLanguageStore();
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);

  const dateAssignments = assignments.filter(
    assignment => assignment.date === selectedDate
  );

  // Get list of vehicles already assigned for this date
  const assignedVehicles = dateAssignments.map(a => a.vehicleId);

  // Get available vehicles (not assigned to anyone else on this date)
  const getAvailableVehicles = (currentAssignmentId: string) => {
    const otherAssignedVehicles = dateAssignments
      .filter(a => a.id !== currentAssignmentId)
      .map(a => a.vehicleId);

    return vehicles.filter(v => !otherAssignedVehicles.includes(v.id));
  };

  const handleVehicleChange = (assignmentId: string, vehicleId: string) => {
    onAssignmentUpdate(assignmentId, { vehicleId });
    setEditingAssignment(null);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {t.todaysAssignments}
        </h3>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {dateAssignments.map((assignment) => {
          const driver = drivers.find(d => d.id === assignment.driverId);
          const vehicle = vehicles.find(v => v.id === assignment.vehicleId);
          const isEditing = editingAssignment === assignment.id;
          const availableVehicles = getAvailableVehicles(assignment.id);

          return (
            <div key={assignment.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {driver?.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{driver?.name}</p>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <select
                          className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                          value={assignment.vehicleId}
                          onChange={(e) => handleVehicleChange(assignment.id, e.target.value)}
                          autoFocus
                        >
                          <option value={assignment.vehicleId}>{vehicle?.plateNumber}</option>
                          {availableVehicles
                            .filter(v => v.id !== assignment.vehicleId)
                            .map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.plateNumber}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{vehicle?.plateNumber}</span>
                          <button
                            onClick={() => setEditingAssignment(assignment.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {assignment.startTime} - {assignment.endTime}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {availableVehicles.length === 0 && !isEditing && (
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    No other vehicles available
                  </div>
                )}
                <button
                  onClick={() => onRemoveAssignment(assignment.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Remove Assignment"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}

        {dateAssignments.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            {t.noAssignments}
          </p>
        )}
      </div>
    </div>
  );
}