import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Notification from "../../components/Notification";
import { useAuth } from "../../context/AuthProvider";

export default function CreateProject({ onCreated }) {
  const { user } = useAuth();
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    status: "pending",
    assigned_user_id: ""
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données pour l'API
      const apiData = {
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
        assigned_user_id: projectData.assigned_user_id || null
      };

      console.log("Envoi des données:", apiData);
      
      const response = await api.post("/projects", apiData);
      console.log("Projet créé:", response.data);
      
      setNotification({ 
        type: "success", 
        message: "Projet créé avec succès !" 
      });
      
      // Réinitialiser après succès
      setTimeout(() => {
        setProjectData({
          title: "",
          description: "",
          status: "pending",
          assigned_user_id: ""
        });
        onCreated(); // Recharge la liste des projets
      }, 1000);
      
    } catch (err) {
      console.error("Erreur détaillée:", err);
      let message = "Erreur lors de la création du projet !";
      
      if (err.response?.data?.errors) {
        message = Object.values(err.response.data.errors).flat().join(" ");
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      
      setNotification({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProjectData({
      title: "",
      description: "",
      status: "pending",
      assigned_user_id: ""
    });
    onCreated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {notification && (
          <Notification 
            {...notification} 
            onClose={() => setNotification(null)} 
          />
        )}
        
        <div className="modal-header">
          <h3>Créer un Projet</h3>
          <button 
            className="modal-close" 
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Titre du projet"
              value={projectData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Description du projet"
              value={projectData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Assigner à</label>
            <select 
              name="assigned_user_id"
              className="form-select"
              value={projectData.assigned_user_id}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Non assigné</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} - {u.roles?.[0]?.name}
                </option>
              ))}
            </select>
            <small className="form-help">
              Laissez "Non assigné" si aucun utilisateur spécifique
            </small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Statut</label>
            <select 
              name="status"
              className="form-select"
              value={projectData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
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
                "Créer le projet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}