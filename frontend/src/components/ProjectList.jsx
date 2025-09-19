// frontend/src/pages/ProjectList.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

export default function ProjectList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert("Accès refusé : rôle insuffisant pour voir les projets");
      } else {
        alert("Erreur lors du chargement des projets");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Liste des projets</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.title}</strong> - {project.status}
            <p style={{ margin: "0.3rem 0" }}>{project.description}</p>
            {(user?.roles?.[0]?.name === "admin" || user?.id === project.user_id) && (
              <>
                {/* Actions selon rôle */}
                <button>Editer</button>
                <button>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
