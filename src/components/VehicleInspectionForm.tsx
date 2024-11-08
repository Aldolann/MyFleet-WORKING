import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import type { VehicleInspection } from '../types';

interface VehicleInspectionFormProps {
  vehicleId: string;
  onSubmit: (inspection: Partial<VehicleInspection>) => void;
}

export default function VehicleInspectionForm({ vehicleId, onSubmit }: VehicleInspectionFormProps) {
  const [inspection, setInspection] = useState<Partial<VehicleInspection>>({
    vehicleId,
    photos: {} as VehicleInspection['photos'],
    date: new Date().toISOString(),
  });

  const handlePhotoUpload = (position: keyof VehicleInspection['photos'], url: string, analysis: any) => {
    setInspection(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [position]: url,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inspection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Odometer Reading
          </label>
          <input
            type="number"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inspection.initialOdometer || ''}
            onChange={(e) => setInspection(prev => ({
              ...prev,
              initialOdometer: parseInt(e.target.value)
            }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Final Odometer Reading
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inspection.finalOdometer || ''}
            onChange={(e) => setInspection(prev => ({
              ...prev,
              finalOdometer: parseInt(e.target.value)
            }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Vehicle Photos</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ImageUpload
            label="Front View"
            onUpload={(url, analysis) => handlePhotoUpload('front', url, analysis)}
          />
          <ImageUpload
            label="Back View"
            onUpload={(url, analysis) => handlePhotoUpload('back', url, analysis)}
          />
          <ImageUpload
            label="Left Side"
            onUpload={(url, analysis) => handlePhotoUpload('left', url, analysis)}
          />
          <ImageUpload
            label="Right Side"
            onUpload={(url, analysis) => handlePhotoUpload('right', url, analysis)}
          />
          <ImageUpload
            label="Left Mirror (1)"
            onUpload={(url, analysis) => handlePhotoUpload('leftMirror1', url, analysis)}
          />
          <ImageUpload
            label="Left Mirror (2)"
            onUpload={(url, analysis) => handlePhotoUpload('leftMirror2', url, analysis)}
          />
          <ImageUpload
            label="Right Mirror (1)"
            onUpload={(url, analysis) => handlePhotoUpload('rightMirror1', url, analysis)}
          />
          <ImageUpload
            label="Right Mirror (2)"
            onUpload={(url, analysis) => handlePhotoUpload('rightMirror2', url, analysis)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={inspection.notes || ''}
          onChange={(e) => setInspection(prev => ({
            ...prev,
            notes: e.target.value
          }))}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="h-4 w-4" />
          Save Inspection
        </button>
      </div>
    </form>
  );
}