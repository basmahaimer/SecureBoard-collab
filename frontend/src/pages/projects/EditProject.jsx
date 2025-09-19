import React, { useState, useEffect } from "react";
import api from "../../api/axios";  // Changé de "../api/axios" à "../../api/axios"
import Notification from "../../components/Notification";

export default function EditProject({ projectId, onUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      const project = response.data;
      setTitle(project.title);
      setDescription(project.description);
      setStatus(project.status);
    } catch (err) {
      console.error("Erreur chargement projet:", err);
      setNotification({ type: "error", message: "Erreur lors du chargement du projet" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/projects/${projectId}`, {
        title,
        description,
        status
      });
      
      setNotification({ type: "success", message: "Projet modifié avec succès !" });
      setTimeout(() => {
        onUpdated();
      }, 1000);
      
    } catch (err) {
      console.error("Erreur modification projet:", err);
      const message = err.response?.data?.message || "Erreur lors de la modification du projet";
      setNotification({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onUpdated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
        
        <div className="modal-header">
          <h3>Modifier le Projet</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Titre du projet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Description du projet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Statut</label>
            <select 
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
                  Modification...
                </>
              ) : (
                "Modifier le projet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}