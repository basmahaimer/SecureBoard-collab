import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Notification from "../components/Notification";

export default function CreateUser({ onCreated }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [roles, setRoles] = useState(["admin","manager","user"]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users", userData); // Laravel attend password_confirmation
      setNotification({ type: "success", message: "Utilisateur créé !" });
      onCreated();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Erreur lors de la création de l'utilisateur !";
      setNotification({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nom" value={userData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mot de passe" value={userData.password} onChange={handleChange} required />
        <input type="password" name="password_confirmation" placeholder="Confirmer mot de passe" value={userData.password_confirmation} onChange={handleChange} required />
        <select name="role" value={userData.role} onChange={handleChange}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button type="submit" disabled={loading}>{loading ? "Création..." : "Créer"}</button>
      </form>
    </div>
  );
}
