import React, { useState } from 'react';
import { X, Clock, Car, Image as ImageIcon } from 'lucide-react';
import PhotoViewer from '../PhotoViewer';

interface WorkDay {
  date: string;
  vehicleId: string;
  vehicleModel: string;
  startTime: string;
  endTime: string;
  startOdometer: number;
  endOdometer: number;
  images: {
    start: string[];
    end: string[];
  };
  notes?: string;
}

interface DayDetailsProps {
  workDay: WorkDay;
  onClose: () => void;
}

export default function DayDetails({ workDay, onClose }: DayDetailsProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);
  
  const distanceTraveled = workDay.endOdometer - workDay.startOdometer;

  const openPhotoViewer = (photos: string[], index: number) => {
    setSelectedPhotos(photos);
    setInitialPhotoIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Work Details - {new Date(workDay.date).toLocaleDateString()}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{workDay.vehicleId}</p>
              <p className="text-sm text-gray-500">{workDay.vehicleModel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {workDay.startTime} - {workDay.endTime}
              </p>
              <p className="text-sm text-gray-500">Work Hours</p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Start Odometer</p>
                <p className="text-lg font-medium text-gray-900">
                  {workDay.startOdometer} km
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Odometer</p>
                <p className="text-lg font-medium text-gray-900">
                  {workDay.endOdometer} km
                </p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-blue-100">
              <p className="text-sm text-gray-500">Distance Traveled</p>
              <p className="text-lg font-medium text-blue-700">
                {distanceTraveled} km
              </p>
            </div>
          </div>

          {workDay.notes && (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
              <p className="text-sm text-gray-500">{workDay.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-medium text-gray-900">Start of Day Photos</h4>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {workDay.images.start.map((url, index) => (
                <img
                  key={`start-${index}`}
                  src={url}
                  alt={`Start inspection ${index + 1}`}
                  className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-90"
                  onClick={() => openPhotoViewer(workDay.images.start, index)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <h4 className="text-sm font-medium text-gray-900">End of Day Photos</h4>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {workDay.images.end.map((url, index) => (
                <img
                  key={`end-${index}`}
                  src={url}
                  alt={`End inspection ${index + 1}`}
                  className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-90"
                  onClick={() => openPhotoViewer(workDay.images.end, index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {viewerOpen && (
        <PhotoViewer
          photos={selectedPhotos}
          initialIndex={initialPhotoIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}