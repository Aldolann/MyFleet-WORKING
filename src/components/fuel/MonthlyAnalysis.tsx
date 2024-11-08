import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyAnalysisProps {
  selectedMonth: string;
}

export default function MonthlyAnalysis({ selectedMonth }: MonthlyAnalysisProps) {
  // Mock data - In production, this would come from your API
  const analysis = {
    totalDistance: 12456,
    totalLiters: 1050.5,
    totalCost: 2345.67,
    averageConsumption: 8.5,
    costPerKm: 0.19,
    comparedToPrevMonth: {
      consumption: -2.3, // percentage
      cost: 5.6, // percentage
    },
    vehicleBreakdown: [
      {
        vehicle: 'ABC-123',
        distance: 4567,
        consumption: 8.2,
        cost: 856.78,
      },
      {
        vehicle: 'XYZ-789',
        distance: 3890,
        consumption: 8.7,
        cost: 789.45,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Avg. Consumption</p>
            <div className={`flex items-center gap-1 text-sm ${
              analysis.comparedToPrevMonth.consumption < 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {analysis.comparedToPrevMonth.consumption < 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              {Math.abs(analysis.comparedToPrevMonth.consumption)}%
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {analysis.averageConsumption.toFixed(1)} L/100km
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Cost per km</p>
            <div className={`flex items-center gap-1 text-sm ${
              analysis.comparedToPrevMonth.cost < 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {analysis.comparedToPrevMonth.cost < 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              {Math.abs(analysis.comparedToPrevMonth.cost)}%
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold">
            €{analysis.costPerKm.toFixed(2)}/km
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900">Vehicle Breakdown</h4>
        <div className="mt-2 space-y-3">
          {analysis.vehicleBreakdown.map((vehicle) => (
            <div
              key={vehicle.vehicle}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{vehicle.vehicle}</p>
                <p className="text-sm text-gray-500">
                  {vehicle.distance.toLocaleString()} km
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Consumption</p>
                  <p className="font-medium text-gray-900">
                    {vehicle.consumption.toFixed(1)} L/100km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="font-medium text-gray-900">
                    €{vehicle.cost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}