import React, { useState } from 'react';
import { Calendar, Image, MessageSquare } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface InspectionHistoryCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

// Mock data - In production, this would come from your API
const mockInspections = [
  {
    date: '2024-03-10',
    vehicle: 'ABC-123',
    startPhotos: ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7', 'url8'],
    endPhotos: ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7', 'url8'],
    messages: [
      { text: 'Minor scratch on right door', time: '09:15' },
      { text: 'All clear at end of shift', time: '17:00' }
    ],
    startOdometer: 12500,
    endOdometer: 12650
  },
  // Add more mock data as needed
];

export default function InspectionHistoryCalendar({
  selectedDate,
  onDateSelect
}: InspectionHistoryCalendarProps) {
  const { translations: t } = useLanguageStore();
  const [selectedView, setSelectedView] = useState<'photos' | 'messages'>('photos');

  const inspection = mockInspections.find(i => i.date === selectedDate);

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Inspection History</h3>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => onDateSelect(e.target.value)}
            />
          </div>
        </div>

        {inspection ? (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Vehicle: {inspection.vehicle}
                </p>
                <p className="text-sm text-gray-500">
                  Distance: {inspection.endOdometer - inspection.startOdometer} km
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedView('photos')}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                    selectedView === 'photos'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Image className="h-4 w-4" />
                  Photos
                </button>
                <button
                  onClick={() => setSelectedView('messages')}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                    selectedView === 'messages'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </button>
              </div>
            </div>

            {selectedView === 'photos' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">Start of Shift</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {inspection.startPhotos.map((_, index) => (
                      <div
                        key={`start-${index}`}
                        className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center"
                      >
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">End of Shift</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {inspection.endPhotos.map((_, index) => (
                      <div
                        key={`end-${index}`}
                        className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center"
                      >
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {inspection.messages.map((message, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <p className="text-sm text-gray-900">{message.text}</p>
                    <p className="mt-1 text-xs text-gray-500">{message.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-500">
            No inspection data available for this date
          </p>
        )}
      </div>
    </div>
  );
}