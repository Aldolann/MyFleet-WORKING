import React, { useState } from 'react';
import { Filter, AlertTriangle, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import type { DamageReport } from '../types';

interface DriverMessage {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  message: string;
  status: 'pending' | 'resolved';
  reportedBy: string;
}

const mockAIReports: DamageReport[] = [
  {
    id: '1',
    vehicleId: 'ABC-123',
    driverId: 'driver1',
    date: '2024-03-08',
    type: 'damage',
    status: 'pending',
    location: 'Front bumper',
    severity: 'high',
    aiAnalysis: {
      hasDamage: true,
      confidence: 0.92,
      location: 'Front bumper',
      severity: 'high',
    },
    reportedBy: 'AI System'
  },
  {
    id: '2',
    vehicleId: 'XYZ-789',
    driverId: 'driver2',
    date: '2024-03-07',
    type: 'damage',
    status: 'resolved',
    location: 'Left door',
    severity: 'medium',
    aiAnalysis: {
      hasDamage: true,
      confidence: 0.85,
      location: 'Left door',
      severity: 'medium',
    },
    reportedBy: 'AI System'
  }
];

const mockDriverMessages: DriverMessage[] = [
  {
    id: 'm1',
    vehicleId: 'ABC-123',
    driverId: 'driver1',
    date: '2024-03-08',
    message: 'Noticed scratches on the right side after delivery',
    status: 'pending',
    reportedBy: 'John Doe'
  },
  {
    id: 'm2',
    vehicleId: 'DEF-456',
    driverId: 'driver3',
    date: '2024-03-07',
    message: 'Strange noise coming from the engine',
    status: 'resolved',
    reportedBy: 'Mike Johnson'
  }
];

export default function Reports() {
  const { user } = useAuthStore();
  const { translations: t } = useLanguageStore();
  const [filter, setFilter] = useState('all');
  const [aiReports, setAIReports] = useState(mockAIReports);
  const [driverMessages, setDriverMessages] = useState(mockDriverMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleStatusChange = (id: string, newStatus: 'resolved' | 'pending', type: 'ai' | 'message') => {
    if (type === 'ai') {
      setAIReports(reports => 
        reports.map(report => 
          report.id === id ? { ...report, status: newStatus } : report
        )
      );
    } else {
      setDriverMessages(messages => 
        messages.map(message => 
          message.id === id ? { ...message, status: newStatus } : message
        )
      );
    }
  };

  const handleDeleteReport = (id: string, type: 'ai' | 'message') => {
    if (type === 'ai') {
      setAIReports(reports => reports.filter(report => report.id !== id));
    } else {
      setDriverMessages(messages => messages.filter(message => message.id !== id));
    }
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: DriverMessage = {
      id: `m${Date.now()}`,
      vehicleId: 'ABC-123', // In production, this would be the current vehicle
      driverId: user?.id || '',
      date: new Date().toISOString().split('T')[0],
      message: newMessage,
      status: 'pending',
      reportedBy: user?.name || ''
    };

    setDriverMessages([message, ...driverMessages]);
    setNewMessage('');
  };

  const filteredAIReports = aiReports.filter(report => {
    if (filter === 'pending') return report.status === 'pending';
    if (filter === 'resolved') return report.status === 'resolved';
    return true;
  });

  const filteredDriverMessages = driverMessages.filter(message => {
    if (filter === 'pending') return message.status === 'pending';
    if (filter === 'resolved') return message.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage vehicle inspection reports and damage notifications
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Reports */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">AI Damage Reports</h3>
          {filteredAIReports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-gray-200 p-4 hover:border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    report.severity === 'high' 
                      ? 'bg-red-100' 
                      : report.severity === 'medium'
                      ? 'bg-yellow-100'
                      : 'bg-orange-100'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      report.severity === 'high'
                        ? 'text-red-600'
                        : report.severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-orange-600'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {report.vehicleId}
                      </h4>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Location: {report.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      AI Confidence: {(report.aiAnalysis.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {report.status === 'pending' ? (
                      <button
                        onClick={() => handleStatusChange(report.id, 'resolved', 'ai')}
                        className="rounded-full p-1 text-gray-400 hover:bg-green-100 hover:text-green-600"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(report.id, 'pending', 'ai')}
                        className="rounded-full p-1 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600"
                        title="Mark as Pending"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReport(report.id, 'ai')}
                      className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                      title="Delete Report"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Driver Messages */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Driver Reports</h3>
          
          {user?.role === 'driver' && (
            <form onSubmit={handleSubmitMessage} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Report an issue..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send
                </button>
              </div>
            </form>
          )}

          {filteredDriverMessages.map((message) => (
            <div
              key={message.id}
              className="rounded-lg border border-gray-200 p-4 hover:border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {message.vehicleId}
                      </h4>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        message.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reported by {message.reportedBy}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {message.status === 'pending' ? (
                      <button
                        onClick={() => handleStatusChange(message.id, 'resolved', 'message')}
                        className="rounded-full p-1 text-gray-400 hover:bg-green-100 hover:text-green-600"
                        title="Mark as Resolved"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(message.id, 'pending', 'message')}
                        className="rounded-full p-1 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600"
                        title="Mark as Pending"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReport(message.id, 'message')}
                      className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                      title="Delete Message"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}