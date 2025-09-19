import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";
import Notification from "../../components/Notification";

export default function DashboardUser() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      const userProjects = res.data;
      setProjects(userProjects);
      
      // Calcul des statistiques
      const statsData = {
        total: userProjects.length,
        pending: userProjects.filter(p => p.status === 'pending').length,
        in_progress: userProjects.filter(p => p.status === 'in_progress').length,
        completed: userProjects.filter(p => p.status === 'completed').length
      };
      setStats(statsData);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Erreur lors du chargement des projets" });
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

        {/* Cartes de statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Projets totaux</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pending}</h3>
              <p>En attente</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>{stats.in_progress}</h3>
              <p>En cours</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Terminés</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Mes Projets</h2>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="loading-text">Chargement de vos projets...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center">
              <p className="empty-state">Aucun projet assigné pour le moment.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Date de création</th>
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
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
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