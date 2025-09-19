import React from "react";
import api from "../api/axios";

export default function NotificationsDropdown({ notifications, onClose, onRead }) {
  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      if (onRead) onRead(); // refresh après lecture
    } catch (err) {
      console.error("Erreur marquage notif:", err);
    }
  };

  return (
    <div
      className="dropdown"
      style={{
        position: "absolute",
        top: "40px",
        right: "0",
        width: "300px",
        maxHeight: "400px",
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #eee",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Notifications</span>
        <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
          ❌
        </button>
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: "10px", textAlign: "center" }}>Aucune notification</div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: n.read_at ? "#f9f9f9" : "#e6f7ff",
            }}
            onClick={() => markAsRead(n.id)}
          >
            <p style={{ margin: 0 }}>{n.data.message}</p>
            {n.data.title && <small style={{ color: "#555" }}>{n.data.title}</small>}
          </div>
        ))
      )}
    </div>
  );
}
