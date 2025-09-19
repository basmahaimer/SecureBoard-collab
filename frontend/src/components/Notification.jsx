import React, { useEffect } from "react";

export default function Notification({ type = "info", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`notification ${type}`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "10px 20px",
        borderRadius: "8px",
        color: "#fff",
        backgroundColor:
          type === "success"
            ? "green"
            : type === "error"
            ? "red"
            : "#333",
      }}
    >
      {message}
    </div>
  );
}
