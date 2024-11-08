import React, { useState } from 'react';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';
import FuelConsumptionChart from '../components/fuel/FuelConsumptionChart';
import FuelEntryForm from '../components/fuel/FuelEntryForm';
import FuelTable from '../components/fuel/FuelTable';
import MonthlyAnalysis from '../components/fuel/MonthlyAnalysis';

export default function FuelManagement() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Fuel Management</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Average Consumption</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">8.5 L/100km</p>
          <p className="text-sm text-gray-500">Last month: 8.7 L/100km</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium">Total Cost</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">€2,345.67</p>
          <p className="text-sm text-gray-500">Last month: €2,156.89</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-medium">Total Distance</h3>
          </div>
          <p className="mt-2 text-3xl font-bold">12,456 km</p>
          <p className="text-sm text-gray-500">Last month: 11,892 km</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium">Consumption Trends</h3>
          <div className="mt-4 h-80">
            <FuelConsumptionChart selectedMonth={selectedMonth} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium">Monthly Analysis</h3>
          <div className="mt-4">
            <MonthlyAnalysis selectedMonth={selectedMonth} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Fuel Entries</h3>
          <FuelEntryForm />
        </div>
        <div className="mt-6">
          <FuelTable selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}