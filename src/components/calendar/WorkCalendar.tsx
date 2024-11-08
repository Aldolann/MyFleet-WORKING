import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Car, Clock, Image, AlertTriangle } from 'lucide-react';
import { useInspectionStore } from '../../store/inspectionStore';
import DayDetails from './DayDetails';

export default function WorkCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const inspections = useInspectionStore(state => state.inspections);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const inspection = inspections[date];
      const isSelected = selectedDate === date;

      days.push(
        <div
          key={day}
          onClick={() => inspection && setSelectedDate(date)}
          className={`h-24 border border-gray-200 p-2 ${
            inspection ? 'cursor-pointer hover:bg-blue-50' : ''
          } ${isSelected ? 'bg-blue-50 border-blue-300' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{day}</span>
            {inspection && (
              <div className="flex gap-1">
                <Car className="h-4 w-4 text-blue-600" />
                {inspection.endInspection?.analyses && 
                  Object.values(inspection.endInspection.analyses).some((a: any) => a.hasDamage) && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {inspection && (
            <div className="mt-1">
              <p className="text-xs text-gray-600">{inspection.vehicleId}</p>
              {inspection.startOdometer && inspection.endOdometer && (
                <p className="text-xs text-blue-600">
                  {inspection.endOdometer - inspection.startOdometer} km
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Work Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {renderCalendar().map((day, index) => (
          <div key={index} className="bg-white">
            {day}
          </div>
        ))}
      </div>

      {selectedDate && inspections[selectedDate] && (
        <DayDetails
          workDay={{
            date: selectedDate,
            vehicleId: inspections[selectedDate].vehicleId,
            vehicleModel: inspections[selectedDate].vehicleModel,
            startTime: '09:00',
            endTime: '17:00',
            startOdometer: inspections[selectedDate].startOdometer || 0,
            endOdometer: inspections[selectedDate].endOdometer || 0,
            images: {
              start: Object.values(inspections[selectedDate].startInspection?.photos || {}),
              end: Object.values(inspections[selectedDate].endInspection?.photos || {})
            },
            notes: inspections[selectedDate].startInspection?.message || ''
          }}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}