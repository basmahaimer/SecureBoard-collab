import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/axios";
import Notification from "../../components/Notification";
import NotificationsDropdown from "../../components/NotificationsDropdown";
import { useAuth } from "../../context/AuthProvider";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    totalUsers: 0,
    totalProjects: 0, 
    pending: 0, 
    inProgress: 0, 
    completed: 0 
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        api.get("/users"),
        api.get("/projects")
      ]);
      
      const users = usersRes.data;
      const projects = projectsRes.data;
      
      const statsData = {
        totalUsers: users.length,
        totalProjects: projects.length,
        pending: projects.filter(p => p.status === 'pending').length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length
      };

      setStats(statsData);
      
      // Simuler des activités récentes
      const activities = [
        { type: 'user', message: 'Nouvel utilisateur inscrit', time: '2 min ago' },
        { type: 'project', message: 'Projet "Site Web" créé', time: '5 min ago' },
        { type: 'notification', message: 'Rapport quotidien généré', time: '1 hour ago' }
      ];
      setRecentActivity(activities);
      
      setLoading(false);
    } catch (err) {
      setNotification({ type: "error", message: "Erreur chargement données" });
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
    fetchData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
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
            <h2>Tableau de Bord Administrateur</h2>
            <span className="user-welcome">Bienvenue, {user?.name}!</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.totalUsers}</h3>
                <p>Utilisateurs</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{stats.totalProjects}</h3>
                <p>Projets Totaux</p>
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
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Activité Récente</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'project' && '📋'}
                  {activity.type === 'notification' && '🔔'}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-grid">
          <div className="card">
            <div className="card-header">
              <h3>Actions Rapides</h3>
            </div>
            <div className="quick-actions">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/admin/users'}
              >
                👥 Gérer les Utilisateurs
              </button>
              <button 
                className="btn btn-success"
                onClick={() => window.location.href = '/projects'}
              >
                📋 Voir les Projets
              </button>
              <button 
                className="btn btn-info"
                onClick={() => window.location.href = '/profile'}
              >
                ⚙️ Paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}