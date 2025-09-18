// frontend/src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to={`/${role}`} className={({ isActive }) => isActive ? "active" : ""}>
            Dashboard
          </NavLink>
        </li>
        {role !== "user" && (
          <li>
            <NavLink to="/projects" className={({ isActive }) => isActive ? "active" : ""}>
              Projets
            </NavLink>
          </li>
        )}
        {role === "admin" && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
              Utilisateurs
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
