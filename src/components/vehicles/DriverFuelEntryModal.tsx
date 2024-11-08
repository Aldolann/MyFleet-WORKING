import React, { useState } from 'react';
import { X, Upload, Fuel } from 'lucide-react';
import { analyzeFuelReceipt } from '../../utils/receiptAnalysis';
import type { Vehicle } from '../../types';

interface DriverFuelEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export default function DriverFuelEntryModal({
  isOpen,
  onClose,
  vehicle
}: DriverFuelEntryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    odometer: '',
    receipt: null as File | null,
    receiptPreview: '',
    liters: '',
    totalCost: '',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Analyze receipt
      const analysis = await analyzeFuelReceipt(file);
      
      setFormData(prev => ({
        ...prev,
        receipt: file,
        receiptPreview: previewUrl,
        liters: analysis.liters.toString(),
        totalCost: analysis.totalCost.toString(),
      }));
    } catch (error) {
      console.error('Error analyzing receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In production, this would upload to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error('Error submitting fuel entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Add Fuel Receipt</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Odometer Reading (km)
              </label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.odometer}
                onChange={e => setFormData({ ...formData, odometer: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Receipt Photo
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4">
                {formData.receiptPreview ? (
                  <div className="relative">
                    <img
                      src={formData.receiptPreview}
                      alt="Receipt preview"
                      className="h-48 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        receipt: null,
                        receiptPreview: ''
                      }))}
                      className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 flex text-sm text-gray-600">
                      <label
                        htmlFor="receipt"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Upload receipt photo</span>
                        <input
                          id="receipt"
                          name="receipt"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {formData.receipt && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-900">Receipt Details</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Liters</p>
                    <p className="text-sm font-medium">{formData.liters} L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Cost</p>
                    <p className="text-sm font-medium">€{formData.totalCost}</p>
                  </div>
                </div>
              </div>
            )}

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
                disabled={loading || !formData.receipt}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  'Submit Receipt'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}