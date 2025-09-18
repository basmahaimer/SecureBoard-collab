import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/axios";
import Notification from "../components/Notification";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";

export default function DashboardManager() {
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
      console.error(err);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/${id}`); // ✅ route backend correcte
      setProjects(projects.filter(p => p.id !== id));
      setNotification({ type: "success", message: "Projet supprimé !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de la suppression !" });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="manager" />
      <div className="dashboard-main">
        <Header />
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
        <h2>Projets</h2>
        <button className="btn-add" onClick={() => setShowCreateProject(true)}>Ajouter un projet</button>
        {showCreateProject && <CreateProject onCreated={() => { setShowCreateProject(false); fetchProjects(); }} />}
        {editProjectId && <EditProject projectId={editProjectId} onUpdated={() => { setEditProjectId(null); fetchProjects(); }} />}
        {loading ? <p>Chargement...</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => setEditProjectId(p.id)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDeleteProject(p.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
