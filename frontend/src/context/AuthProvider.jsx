import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch (err) {
      console.error("Erreur fetch user:", err);
      logout();
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const loginUser = (newToken) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);