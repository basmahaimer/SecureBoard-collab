// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function ProtectedRoute({ requiredRole }) {
  const { user, loading, hasRole } = useAuth();
  if (loading) return <div className="p-6">Checking session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
