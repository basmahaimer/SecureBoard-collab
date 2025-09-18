import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <h2>SecureBoard {user && `- ${user.name}`}</h2>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
