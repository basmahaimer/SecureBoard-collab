import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const role = user?.roles?.[0]?.name;

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    closeSidebar();
    // Redirection selon le rôle
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "manager") {
      navigate("/manager");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <button className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </button>

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer', margin: 0 }}
            title="Retour à la page d'accueil"
          >
            SecureBoard
          </h2>
          <button className="sidebar-close" onClick={closeSidebar}>×</button>
        </div>
        
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              📊 Dashboard
            </NavLink>
          </li>
          
          {role === "admin" && (
            <>
              <li>
                <NavLink 
                  to="/admin/users" 
                  className={({ isActive }) => isActive ? "active" : ""}
                  onClick={closeSidebar}
                >
                  👥 Utilisateurs
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => isActive ? "active" : ""}
                  onClick={closeSidebar}
                >
                  🏠 Accueil Admin
                </NavLink>
              </li>
            </>
          )}
          
          {(role === "admin" || role === "manager") && (
            <li>
              <NavLink 
                to="/projects" 
                className={({ isActive }) => isActive ? "active" : ""}
                onClick={closeSidebar}
              >
                📋 Projets
              </NavLink>
            </li>
          )}
          
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? "active" : ""}
              onClick={closeSidebar}
            >
              👤 Mon Profil
            </NavLink>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role-badge">{role}</p>
          </div>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            🚪 Déconnexion
          </button>
        </div>
      </nav>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
}