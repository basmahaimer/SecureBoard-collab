import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";  // Doit être "../../api/axios" (pas "/../../api/axios")
import Notification from "../../components/Notification";
import NotificationsDropdown from "../../components/NotificationsDropdown";
import CreateProject from "../projects/CreateProject";
import EditProject from "../projects/EditProject";

export default function DashboardManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

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

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/unread");
      setNotifications(res.data);
      setUnreadCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      setNotification({ type: "success", message: "Projet supprimé avec succès !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de la suppression !" });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="manager" />
      <div className="dashboard-main">
        <Header />

        <div className="header-actions">
          <button 
            className="notification-bell"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifDropdown && (
            <NotificationsDropdown
              notifications={notifications}
              onClose={() => setShowNotifDropdown(false)}
              onRead={fetchNotifications}
            />
          )}
        </div>

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
                fetchNotifications();
              }}
            />
          )}
          
          {editProjectId && (
            <EditProject
              projectId={editProjectId}
              onUpdated={() => {
                setEditProjectId(null);
                fetchProjects();
                fetchNotifications();
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
                      <td>{p.user?.name || 'Inconnu'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditProjectId(p.id)}
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteProject(p.id)}
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