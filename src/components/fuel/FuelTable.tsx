import React from 'react';
import { Eye, Download } from 'lucide-react';

interface FuelTableProps {
  selectedMonth: string;
}

export default function FuelTable({ selectedMonth }: FuelTableProps) {
  // Mock data - In production, this would come from your API
  const entries = [
    {
      id: '1',
      date: '2024-03-10',
      vehicle: 'ABC-123',
      odometer: 45678,
      liters: 45.5,
      totalCost: 89.99,
      receiptUrl: '#',
    },
    {
      id: '2',
      date: '2024-03-08',
      vehicle: 'XYZ-789',
      odometer: 34567,
      liters: 50.2,
      totalCost: 98.50,
      receiptUrl: '#',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Odometer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liters
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipt
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {entry.vehicle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {entry.odometer.toLocaleString()} km
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {entry.liters.toFixed(1)} L
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                €{entry.totalCost.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    title="View Receipt"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    title="Download Receipt"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}