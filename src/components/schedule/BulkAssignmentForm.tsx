import React, { useState } from 'react';
import { Calendar, Users, Car } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import type { Driver, Vehicle } from '../../types';

interface BulkAssignmentFormProps {
  onSubmit: (date: string, selectedDrivers: string[], startTime: string, endTime: string) => Promise<void>;
  drivers: Driver[];
  availableVehicles: Vehicle[];
}

export default function BulkAssignmentForm({ onSubmit, drivers, availableVehicles }: BulkAssignmentFormProps) {
  const { translations: t } = useLanguageStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDrivers.length === 0) return;
    
    setLoading(true);
    try {
      await onSubmit(date, selectedDrivers, startTime, endTime);
      setSelectedDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDriver = (driverId: string) => {
    setSelectedDrivers(current =>
      current.includes(driverId)
        ? current.filter(id => id !== driverId)
        : [...current, driverId]
    );
  };

  const toggleAllDrivers = () => {
    setSelectedDrivers(current =>
      current.length === drivers.length ? [] : drivers.map(d => d.id)
    );
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-medium text-gray-900">{t.newAssignment}</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t.date}
          </label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.startTime}
            </label>
            <input
              type="time"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.endTime}
            </label>
            <input
              type="time"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {t.selectDrivers}
            </label>
            <button
              type="button"
              onClick={toggleAllDrivers}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {selectedDrivers.length === drivers.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
            {drivers.map((driver) => (
              <label
                key={driver.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDrivers.includes(driver.id)}
                    onChange={() => toggleDriver(driver.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{driver.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {driver.status === 'active' ? 'Available' : 'Off Duty'}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {availableVehicles.length} vehicles available for {selectedDrivers.length} selected drivers
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || selectedDrivers.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t.creating}
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                {t.createAssignments}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}