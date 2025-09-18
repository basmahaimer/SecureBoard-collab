import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./context/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardManager from "./pages/DashboardManager";
import DashboardUser from "./pages/DashboardUser";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <PrivateRoute role="manager">
              <DashboardManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute role="user">
              <DashboardUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
