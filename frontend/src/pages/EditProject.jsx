import React, { useState } from "react";
import api from "../api/axios";
import Notification from "../components/Notification";

export default function CreateProject({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/projects", { title, description, status });
      setNotification({ type: "success", message: "Projet créé avec succès !" });
      setTitle("");
      setDescription("");
      setStatus("pending");
      onCreated();
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la création du projet !";
      setNotification({ type: "error", message });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      <form onSubmit={handleSubmit}>
        <h3>Créer un Projet</h3>
        <div>
          <label>Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
