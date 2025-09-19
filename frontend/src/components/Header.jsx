import React from "react";
import { useAuth } from "../context/AuthProvider";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h2>
          <span className="header-title">SecureBoard</span>
          {user && <span className="header-user">- Bienvenue, {user.name}</span>}
        </h2>
        <div className="header-info">
          <span className="user-role">
            {user?.roles?.[0]?.name === 'admin' && '👑 Administrateur'}
            {user?.roles?.[0]?.name === 'manager' && '📊 Manager'}
            {user?.roles?.[0]?.name === 'user' && '👤 Utilisateur'}
          </span>
        </div>
      </div>
    </header>
  );
}