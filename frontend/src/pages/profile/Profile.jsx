import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";
import Notification from "../../components/Notification";
import { useAuth } from "../../context/AuthProvider";

// ⚠️ ASSUREZ-VOUS D'AVOIR export default (pas export const Profile)
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/user", {
        name: formData.name,
        email: formData.email
      });

      updateUser(response.data);
      setNotification({ type: "success", message: "Profil mis à jour avec succès!" });
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      setNotification({ type: "error", message: "Erreur lors de la mise à jour du profil" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({ type: "error", message: "Les mots de passe ne correspondent pas" });
      return;
    }

    setLoading(true);

    try {
      await api.put("/user/password", {
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword
      });

      setNotification({ type: "success", message: "Mot de passe mis à jour avec succès!" });
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error("Erreur changement mot de passe:", err);
      const message = err.response?.data?.message || "Erreur lors du changement de mot de passe";
      setNotification({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        
        {notification && (
          <Notification {...notification} onClose={() => setNotification(null)} />
        )}

        <div className="card">
          <div className="card-header">
            <h2>Mon Profil</h2>
          </div>

          <div className="profile-section">
            <h3>Informations Personnelles</h3>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rôle</label>
                <input
                  type="text"
                  className="form-input"
                  value={user?.roles?.[0]?.name || 'Utilisateur'}
                  disabled
                  style={{ background: 'var(--gray-100)' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Mise à jour..." : "Mettre à jour le profil"}
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h3>Changer le Mot de Passe</h3>
            <form onSubmit={handlePasswordUpdate} className="profile-form">
              <div className="form-group">
                <label className="form-label">Mot de passe actuel</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-input"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-input"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-warning"
                disabled={loading}
              >
                {loading ? "Changement..." : "Changer le mot de passe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}