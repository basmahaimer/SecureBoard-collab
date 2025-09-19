import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";
import Notification from "../../components/Notification";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";
import { useAuth } from "../../context/AuthProvider";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      setNotification({ type: "error", message: "Erreur chargement projets" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      setNotification({ type: "success", message: "Projet supprimé !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de la suppression !" });
    }
  };

  const canEditProject = (project) => {
    return user?.roles?.[0]?.name === 'admin' || project.user_id === user?.id;
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
            <h2>Gestion des Projets</h2>
            <button 
              className="btn btn-success"
              onClick={() => setShowCreateProject(true)}
            >
              <span>+</span>
              Nouveau Projet
            </button>
          </div>

          {showCreateProject && (
            <CreateProject
              onCreated={() => {
                setShowCreateProject(false);
                fetchProjects();
              }}
            />
          )}
          
          {editProjectId && (
            <EditProject
              projectId={editProjectId}
              onUpdated={() => {
                setEditProjectId(null);
                fetchProjects();
              }}
            />
          )}

          {loading ? (
            <div className="text-center">
              <p className="loading-text">Chargement des projets...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Créateur</th>
                    <th>Assigné à</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="project-title">{p.title}</td>
                      <td className="project-description">{p.description}</td>
                      <td>
                        <span className={`status-badge status-${p.status}`}>
                          {p.status === 'pending' && '⏳ En attente'}
                          {p.status === 'in_progress' && '🚀 En cours'}
                          {p.status === 'completed' && '✅ Terminé'}
                        </span>
                      </td>
                      <td>{p.creator_name || 'Inconnu'}</td>
                      <td>{p.assigned_user_name || 'Non assigné'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditProjectId(p.id)}
                            disabled={!canEditProject(p)}
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProject(p.id)}
                            disabled={!canEditProject(p)}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}