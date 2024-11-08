import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { useInspectionStore } from '../../store/inspectionStore';
import ImageUpload from '../ImageUpload';
import type { VehicleInspection } from '../../types';

interface VehicleInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  isStartInspection: boolean;
  onSubmit: (inspection: Partial<VehicleInspection>) => Promise<void>;
}

export default function VehicleInspectionModal({ 
  isOpen, 
  onClose, 
  vehicleId, 
  isStartInspection, 
  onSubmit 
}: VehicleInspectionModalProps) {
  const { translations: t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [odometer, setOdometer] = useState('');
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [message, setMessage] = useState('');

  const addInspection = useInspectionStore(state => state.addInspection);

  const handlePhotoUpload = (position: string, url: string, analysis: any) => {
    setPhotos(prev => ({ ...prev, [position]: url }));
    setAnalyses(prev => ({ ...prev, [position]: analysis }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!odometer) {
      alert('Please enter odometer reading');
      return;
    }
    if (Object.keys(photos).length < 4) {
      alert('Please upload all required photos');
      return;
    }

    setLoading(true);
    try {
      const inspectionData = {
        vehicleId,
        odometer: parseInt(odometer),
        photos,
        analyses: isStartInspection ? {} : analyses,
        message,
        timestamp: new Date().toISOString(),
        type: isStartInspection ? 'start' as const : 'end' as const,
        vehicleModel: '2023 Ford Transit', // In production, this would come from vehicle data
      };

      await onSubmit(inspectionData);
      addInspection(inspectionData);
      onClose();
    } catch (error) {
      console.error('Error submitting inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900">
            {isStartInspection ? t.startInspection : t.endInspection}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.odometerReading}
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="Enter current odometer reading"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Required Photos ({Object.keys(photos).length}/4)
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-6">
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
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any issues or comments to report?"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || Object.keys(photos).length < 4}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Submit Inspection
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}