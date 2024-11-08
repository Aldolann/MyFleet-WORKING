import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { Lock, UserX, Users } from 'lucide-react';
import InviteAdminModal from '../components/settings/InviteAdminModal';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const { translations: t } = useLanguageStore();
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInviteAdmin, setShowInviteAdmin] = useState(false);
  const [adminInvites, setAdminInvites] = useState([
    { email: 'pending@example.com', status: 'pending', date: '2024-03-10' },
  ]);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [error, setError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    // In production, this would call your API
    console.log('Password changed');
    setShowPasswordForm(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = async () => {
    // In production, this would call your API
    await logout();
    navigate('/login');
  };

  const handleInviteAdmin = async (email: string) => {
    // In production, this would generate a unique token and send an email via AWS SES
    const newInvite = {
      email,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setAdminInvites([newInvite, ...adminInvites]);

    // Mock registration link - In production, this would be a secure token
    const registrationLink = `/register?token=admin_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Admin registration link: ${registrationLink}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t.settings}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Admin Invites - Only show for admin users */}
        {user?.role === 'admin' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Admin Management</h3>
              </div>
              <button
                onClick={() => setShowInviteAdmin(true)}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Invite Admin
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {adminInvites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                    <p className="text-xs text-gray-500">Invited on {invite.date}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    {invite.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Change Password */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showPasswordForm ? 'Cancel' : 'Change'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* Delete Account */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Yes, Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <InviteAdminModal
        isOpen={showInviteAdmin}
        onClose={() => setShowInviteAdmin(false)}
        onSubmit={handleInviteAdmin}
      />
    </div>
  );
}