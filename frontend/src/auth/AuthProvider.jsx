// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { authClient } from '../api/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/user'); // expects { user: {...} } or user object
      setUser(data.user ?? data);
    } catch (e) {
      setUser(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUser(); }, []);

  const login = async (credentials) => {
    // Sanctum cookie first
    await authClient.get('/sanctum/csrf-cookie');
    await authClient.post('/login', credentials);
    await fetchUser();
  };

  const register = async (payload) => {
    await authClient.get('/sanctum/csrf-cookie');
    await authClient.post('/register', payload);
    await fetchUser();
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch (e) {}
    setUser(null);
    window.location.href = '/login';
  };

  const hasRole = (role) => {
    if (!user) return false;
    const roles = user.roles ?? user.roles?.map(r => r.name) ?? [];
    return roles.some(r => r === role || r.name === role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
