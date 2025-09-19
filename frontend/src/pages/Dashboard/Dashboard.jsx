import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";
import Notification from "../../components/Notification";
import { useAuth } from "../../context/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    totalProjects: 0, 
    pending: 0, 
    inProgress: 0, 
    completed: 0 
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      let projectsRes;
      // Si l'utilisateur est un user normal, on filtre ses projets
      if (user?.roles?.[0]?.name === 'user') {
        projectsRes = await api.get("/projects");
        // Filtrer les projets assignés à l'utilisateur OU créés par lui
        const allProjects = projectsRes.data;
        projectsRes.data = allProjects.filter(project => 
          project.assigned_user_id === user.id || project.user_id === user.id
        );
      } else {
        projectsRes = await api.get("/projects");
      }
      
      const projects = projectsRes.data;
      
      const statsData = {
        totalProjects: projects.length,
        pending: projects.filter(p => p.status === 'pending').length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length
      };

      setStats(statsData);
      setRecentProjects(projects.slice(0, 5));
      setLoading(false);

    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setNotification({ type: "error", message: "Erreur lors du chargement des données" });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-main">
          <Header />
          <div className="text-center">
            <p className="loading-text">Chargement du dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h2>Tableau de Bord</h2>
            <span className="user-welcome">Bienvenue, {user?.name}!</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{stats.totalProjects}</h3>
                <p>Projets Totaux</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{stats.pending}</h3>
                <p>En Attente</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-content">
                <h3>{stats.inProgress}</h3>
                <p>En Cours</p>
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

          <div className="recent-section">
            <h3>Projets Récents</h3>
            {recentProjects.length === 0 ? (
              <p className="empty-state">Aucun projet récent</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Assigné à</th>
                      <th>Statut</th>
                      <th>Créé le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id}>
                        <td className="project-title">{project.title}</td>
                        <td>{project.assigned_user_name || 'Non assigné'}</td>
                        <td>
                          <span className={`status-badge status-${project.status}`}>
                            {project.status === 'pending' && '⏳ En attente'}
                            {project.status === 'in_progress' && '🚀 En cours'}
                            {project.status === 'completed' && '✅ Terminé'}
                          </span>
                        </td>
                        <td>{new Date(project.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}