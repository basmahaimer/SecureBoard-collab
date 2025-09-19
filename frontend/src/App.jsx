import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './context/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardAdmin from './pages/dashboard/DashboardAdmin'; // Gardez cette importation
import DashboardManager from './pages/dashboard/DashboardManager';
import DashboardUser from './pages/dashboard/DashboardUser';
import AdminUsers from './pages/admin/AdminUsers';
import Projects from './pages/projects/Projects';
import Profile from './pages/profile/Profile';
import Error from './components/Error';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes protégées */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute requiredRole="admin">
              <DashboardAdmin />
            </PrivateRoute>
          } />
          
          <Route path="/admin/users" element={
            <PrivateRoute requiredRole="admin">
              <AdminUsers />
            </PrivateRoute>
          } />
          
          <Route path="/manager" element={
            <PrivateRoute requiredRole="manager">
              <DashboardManager />
            </PrivateRoute>
          } />
          
          <Route path="/user" element={
            <PrivateRoute>
              <DashboardUser />
            </PrivateRoute>
          } />
          
          <Route path="/projects" element={
            <PrivateRoute requiredRole={['admin', 'manager']}>
              <Projects />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          {/* Redirections par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;