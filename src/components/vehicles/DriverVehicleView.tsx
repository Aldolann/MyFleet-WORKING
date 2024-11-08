import React, { useState } from 'react';
import { Car, Camera, QrCode, Fuel } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useLanguageStore } from '../../store/languageStore';
import VehicleInspectionModal from './VehicleInspectionModal';
import DriverFuelEntryModal from './DriverFuelEntryModal';
import type { Vehicle, VehicleInspection } from '../../types';

interface DriverVehicleViewProps {
  vehicle: Vehicle;
  onInspectionSubmit: (inspection: Partial<VehicleInspection>) => Promise<void>;
}

export default function DriverVehicleView({ vehicle, onInspectionSubmit }: DriverVehicleViewProps) {
  const { translations: t } = useLanguageStore();
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isStartInspection, setIsStartInspection] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const handleInspectionSubmit = async (inspection: Partial<VehicleInspection>) => {
    try {
      await onInspectionSubmit(inspection);
      if (isStartInspection) {
        setHasStarted(true);
      } else {
        setHasStarted(false);
      }
      setShowInspectionModal(false);
    } catch (error) {
      console.error('Error submitting inspection:', error);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {vehicle.plateNumber}
            </h3>
            <p className="text-sm text-gray-500">{vehicle.model}</p>
            <p className="text-xs text-gray-400">VIN: {vehicle.vin}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowQR(!showQR)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <QrCode className="h-4 w-4" />
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>

          <button
            onClick={() => setShowFuelModal(true)}
            className="inline-flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
          >
            <Fuel className="h-4 w-4" />
            Add Fuel Receipt
          </button>

          {!hasStarted ? (
            <button
              onClick={() => {
                setIsStartInspection(true);
                setShowInspectionModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Camera className="h-4 w-4" />
              {t.startInspection}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsStartInspection(false);
                setShowInspectionModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Camera className="h-4 w-4" />
              End Inspection
            </button>
          )}
        </div>
      </div>

      {showQR && (
        <div className="mt-6 flex justify-center">
          <div className="text-center">
            <QRCode value={vehicle.vin} size={200} />
            <p className="mt-2 text-sm text-gray-500">Vehicle VIN QR Code</p>
          </div>
        </div>
      )}

      {showInspectionModal && (
        <VehicleInspectionModal
          isOpen={showInspectionModal}
          onClose={() => setShowInspectionModal(false)}
          vehicleId={vehicle.id}
          isStartInspection={isStartInspection}
          onSubmit={handleInspectionSubmit}
        />
      )}

      {showFuelModal && (
        <DriverFuelEntryModal
          isOpen={showFuelModal}
          onClose={() => setShowFuelModal(false)}
          vehicle={vehicle}
        />
      )}
    </div>
  );
}