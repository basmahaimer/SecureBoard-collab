import React, { useState } from "react";
import api from "../../api/axios";  // Changé de "../api/axios" à "../../api/axios"
import Notification from "../../components/Notification";

export default function CreateUser({ onCreated }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [roles] = useState(["admin","manager","user"]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    if (userData.password !== userData.password_confirmation) {
      setNotification({ type: "error", message: "Les mots de passe ne correspondent pas" });
      return;
    }
    
    if (userData.password.length < 8) {
      setNotification({ type: "error", message: "Le mot de passe doit contenir au moins 8 caractères" });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/users", userData);
      
      setNotification({ 
        type: "success", 
        message: response.data.message || "Utilisateur créé avec succès !" 
      });
      
      // Réinitialiser le formulaire après un court délai
      setTimeout(() => {
        setUserData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "user",
        });
        onCreated();
      }, 1000);
      
    } catch (err) {
      console.error("Erreur détaillée:", err);
      
      let message = "Erreur lors de la création de l'utilisateur";
      
      if (err.response?.status === 422 && err.response?.data?.errors) {
        // Afficher les erreurs de validation Laravel
        const errors = err.response.data.errors;
        message = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err.code === "ERR_NETWORK") {
        message = "Erreur de connexion au serveur";
      }
      
      setNotification({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "user",
    });
    onCreated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
        
        <div className="modal-header">
          <h3>Créer un Utilisateur</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Nom complet *</label>
            <input 
              type="text" 
              name="name" 
              className="form-input"
              placeholder="Entrez le nom complet" 
              value={userData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input 
              type="email" 
              name="email" 
              className="form-input"
              placeholder="Entrez l'adresse email" 
              value={userData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input 
              type="password" 
              name="password" 
              className="form-input"
              placeholder="Minimum 8 caractères" 
              value={userData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe *</label>
            <input 
              type="password" 
              name="password_confirmation" 
              className="form-input"
              placeholder="Confirmez le mot de passe" 
              value={userData.password_confirmation} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Rôle *</label>
            <select 
              name="role" 
              className="form-select"
              value={userData.role} 
              onChange={handleChange}
            >
              {roles.map(r => (
                <option key={r} value={r}>
                  {r === 'admin' ? 'Administrateur' : 
                   r === 'manager' ? 'Manager' : 'Utilisateur'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Création...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Créer l'utilisateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}