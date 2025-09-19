// frontend/src/pages/EditUser.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/axios";  // Changé de "../api/axios" à "../../api/axios"
import Notification from "../../components/Notification";

export default function EditUser({ userId, onUpdated }) {
  const [userData, setUserData] = useState({ name: "", email: "", roles: [] });
  const [notification, setNotification] = useState(null);

  // Préremplir le formulaire depuis la liste globale du dashboard
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ⚠️ Pas besoin de GET /users/{id} car backend n’a pas cette route pour admin
        // On peut récupérer depuis le dashboard, sinon il faut l’envoyer en prop
        // Pour l’exemple, on fait un GET de tous les users et on filtre
        const res = await api.get("/users");
        const user = res.data.find(u => u.id === userId);
        if (user) setUserData({ name: user.name, email: user.email, roles: user.roles.map(r => r.name) });
      } catch (err) {
        setNotification({ type: "error", message: "Erreur chargement utilisateur" });
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${userId}`, {
        name: userData.name,
        email: userData.email,
        roles: userData.roles, // backend doit accepter roles en tableau de string ou id
      });
      setNotification({ type: "success", message: "Utilisateur mis à jour !" });
      onUpdated(); // rafraîchir la liste dans le dashboard
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Erreur lors de la mise à jour !" });
    }
  };

  return (
    <div className="auth-wrapper">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      <div className="auth-box">
        <h2>Modifier l'utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Nom"
            required
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {/* Roles en texte pour simplifier, tu peux améliorer avec multi-select */}
          <input
            type="text"
            name="roles"
            value={userData.roles.join(", ")}
            onChange={e => setUserData(prev => ({ ...prev, roles: e.target.value.split(",").map(r => r.trim()) }))}
            placeholder="Rôles (ex: admin, manager)"
            required
          />
          <button type="submit">Modifier</button>
        </form>
      </div>
    </div>
  );
}
