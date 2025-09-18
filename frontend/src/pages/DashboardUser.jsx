import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/axios";
import Notification from "../components/Notification";

export default function DashboardUser() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Ici tu peux filtrer les projets selon l'utilisateur connecté si ton API le permet
      const res = await api.get("/projects");
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Erreur chargement projets" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar role="user" />
      <div className="dashboard-main">
        <Header />
        {notification && (
          <Notification {...notification} onClose={() => setNotification(null)} />
        )}

        <h2>Mes Projets</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
