import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import AdminSignupForm from './components/AdminSignupForm';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import { useAuthStore } from './store/authStore';

export default function App() {
  const user = useAuthStore(state => state.user);

  return (
    <Routes>
      <Route path="/login" element={
        !user ? <LoginForm /> : <Navigate to="/" replace />
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<AdminSignupForm />} />
      
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Drivers />
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/maintenance" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Maintenance />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}