import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";
import Notification from "../../components/Notification";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setNotification({ type: "error", message: "Erreur chargement utilisateurs" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setNotification({ type: "success", message: "Utilisateur supprimé !" });
    } catch (err) {
      setNotification({ type: "error", message: "Erreur lors de la suppression !" });
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
            <h2>Gestion des Utilisateurs</h2>
            <button 
              className="btn btn-success"
              onClick={() => setShowCreateUser(true)}
            >
              <span>+</span>
              Nouvel Utilisateur
            </button>
          </div>

          {showCreateUser && (
            <CreateUser
              onCreated={() => {
                setShowCreateUser(false);
                fetchUsers();
              }}
            />
          )}
          
          {editUserId && (
            <EditUser
              userId={editUserId}
              onUpdated={() => {
                setEditUserId(null);
                fetchUsers();
              }}
            />
          )}

          {loading ? (
            <div className="text-center">
              <p className="loading-text">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <div className="table-container">
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
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.roles?.map((r) => r.name).join(", ") || 'Aucun rôle'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditUserId(u.id)}
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(u.id)}
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