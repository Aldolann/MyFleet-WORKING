import React, { useState } from 'react';
import { Clock, Users, Car, Image } from 'lucide-react';
import type { Assignment, Driver, Vehicle } from '../../types';
import { useLanguageStore } from '../../store/languageStore';

interface AssignmentCalendarProps {
  assignments: Assignment[];
  drivers: Driver[];
  vehicles: Vehicle[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAssignmentUpdate: (assignmentId: string, updates: Partial<Assignment>) => void;
}

export default function AssignmentCalendar({
  assignments,
  drivers,
  vehicles,
  selectedDate,
  onDateChange,
  onAssignmentUpdate,
}: AssignmentCalendarProps) {
  const { translations: t } = useLanguageStore();
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const dateAssignments = assignments.filter(
    assignment => assignment.date === selectedDate
  );

  const handleVehicleChange = (assignmentId: string, vehicleId: string) => {
    onAssignmentUpdate(assignmentId, { vehicleId });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {t.assignmentsFor}
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
          const isSelected = selectedAssignment === assignment.id;

          return (
            <div
              key={assignment.id}
              className={`rounded-lg border p-4 transition-colors ${
                isSelected ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {driver?.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <select
                        className="text-sm text-gray-500 border-none focus:ring-0"
                        value={assignment.vehicleId}
                        onChange={(e) => handleVehicleChange(assignment.id, e.target.value)}
                      >
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.plateNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {assignment.startTime} - {assignment.endTime}
                  </p>
                  {assignment.status === 'completed' && (
                    <button
                      onClick={() => setSelectedAssignment(
                        isSelected ? null : assignment.id
                      )}
                      className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Image className="h-4 w-4" />
                      {t.viewPhotos}
                    </button>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {t.startPhotos}
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {/* In production, these would be actual inspection photos */}
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={`start-${n}`}
                          className="aspect-square rounded bg-gray-100 flex items-center justify-center"
                        >
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {t.endPhotos}
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={`end-${n}`}
                          className="aspect-square rounded bg-gray-100 flex items-center justify-center"
                        >
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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