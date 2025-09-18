// frontend/src/components/Notification.jsx
import React, { useEffect } from "react";

export default function Notification({ type = "info", message, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification ${type}`}>
      <i className="fas fa-info-circle"></i>
      {message}
    </div>
  );
}
