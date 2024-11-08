import React from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface DamageReportProps {
  date: string;
  vehicle: string;
  driver: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  status: 'pending' | 'resolved';
}

export default function DamageReport({
  date,
  vehicle,
  driver,
  severity,
  location,
  status,
}: DamageReportProps) {
  const severityColors = {
    low: 'bg-yellow-50 text-yellow-800',
    medium: 'bg-orange-50 text-orange-800',
    high: 'bg-red-50 text-red-800',
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700',
    resolved: 'bg-green-50 text-green-700',
  };

  const StatusIcon = status === 'resolved' ? CheckCircle2 : Clock;

  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-red-100 p-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">{vehicle}</h4>
            <p className="mt-1 text-sm text-gray-500">Reported by {driver}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>
          <StatusIcon className="h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {new Date(date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColors[severity]}`}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
        </span>
      </div>
    </div>
  );
}