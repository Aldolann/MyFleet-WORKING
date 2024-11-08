import React, { useState } from 'react';
import { Plus, Mail, CheckCircle, XCircle, User, Ban, Search, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDriverStore } from '../store/driverStore';
import InviteDriverModal from '../components/drivers/InviteDriverModal';
import type { Driver } from '../types';

export default function Drivers() {
  const { user, fleet } = useAuthStore();
  const { drivers, updateDriverStatus, removeDriver } = useDriverStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [invites, setInvites] = useState([
    { email: 'pending@example.com', status: 'pending', date: '2024-03-10' },
    { email: 'accepted@example.com', status: 'accepted', date: '2024-03-09' },
  ]);

  const handleInvite = async (email: string) => {
    const newInvite = {
      email,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setInvites([newInvite, ...invites]);
    setShowInviteModal(false);
  };

  const handleCancelInvite = (email: string) => {
    setInvites(invites.filter(invite => invite.email !== email));
  };

  const handleCancelDriver = (driverId: string) => {
    updateDriverStatus(driverId, 'inactive');
  };

  const handleReactivateDriver = (driverId: string) => {
    updateDriverStatus(driverId, 'active');
  };

  const handleDeleteDriver = (driverId: string) => {
    if (confirm('Are you sure you want to permanently delete this driver? This action cannot be undone.')) {
      removeDriver(driverId);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = (
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesSearch;
  });

  const activeDrivers = filteredDrivers.filter(driver => driver.status === 'active');
  const inactiveDrivers = filteredDrivers.filter(driver => driver.status === 'inactive');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Drivers</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage drivers for {fleet?.name}
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Invite Driver
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search drivers by name or email..."
          className="flex-1 border-none focus:ring-0 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Active Drivers List */}
      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Drivers</h3>
          <div className="mt-6 divide-y divide-gray-200">
            {activeDrivers.map((driver) => (
              <div key={driver.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {driver.status}
                  </span>
                  <button
                    onClick={() => handleCancelDriver(driver.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    <Ban className="h-3 w-3" />
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(driver.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {activeDrivers.length === 0 && (
              <p className="py-4 text-sm text-gray-500">No active drivers</p>
            )}
          </div>
        </div>
      </div>

      {/* Inactive Drivers List */}
      {inactiveDrivers.length > 0 && (
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Inactive Drivers</h3>
            <div className="mt-6 divide-y divide-gray-200">
              {inactiveDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {driver.status}
                    </span>
                    <button
                      onClick={() => handleReactivateDriver(driver.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Reactivate
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Invites */}
      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending Invites</h3>
          <div className="mt-4 divide-y divide-gray-200">
            {invites.map((invite) => (
              <div key={invite.email} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  {invite.status === 'pending' ? (
                    <div className="rounded-full bg-yellow-100 p-1">
                      <Mail className="h-4 w-4 text-yellow-600" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-green-100 p-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                    <p className="text-xs text-gray-500">Invited on {invite.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      invite.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {invite.status}
                  </span>
                  {invite.status === 'pending' && (
                    <button
                      onClick={() => handleCancelInvite(invite.email)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InviteDriverModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSubmit={handleInvite}
      />
    </div>
  );
}