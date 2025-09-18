import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/axios";
import Notification from "../components/Notification";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  // Fetch users & projects
  const fetchData = async () => {
    try {
      const usersRes = await api.get("/users");
      const projectsRes = await api.get("/projects");
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
      setLoading(false);
    } catch (err) {
      setNotification({ type: "error", message: "Erreur chargement données" });
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      setNotification({ type: "success", message: "Utilisateur supprimé !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de la suppression !" });
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      setNotification({ type: "success", message: "Projet supprimé !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de la suppression !" });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <div className="dashboard-main">
        <Header />
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

        {/* === Utilisateurs === */}
        <h2>Liste des Utilisateurs</h2>
        <button className="btn-add" onClick={() => setShowCreateUser(true)}>Ajouter un utilisateur</button>
        {showCreateUser && <CreateUser onCreated={() => { setShowCreateUser(false); fetchData(); }} />}
        {editUserId && <EditUser userId={editUserId} onUpdated={() => { setEditUserId(null); fetchData(); }} />}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.roles.map(r => r.name).join(", ")}</td>
                  <td>
                    <button className="btn-edit" onClick={() => setEditUserId(u.id)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDeleteUser(u.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* === Projets === */}
        <h2>Projets</h2>
        <button className="btn-add" onClick={() => setShowCreateProject(true)}>Ajouter un projet</button>
        {showCreateProject && <CreateProject onCreated={() => { setShowCreateProject(false); fetchData(); }} />}
        {editProjectId && <EditProject projectId={editProjectId} onUpdated={() => { setEditProjectId(null); fetchData(); }} />}
        {loading ? (
          <p>Chargement...</p>
        ) : (
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
