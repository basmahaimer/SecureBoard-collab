import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { initEcho } from '../api/echo';

export default function NotificationCenter(){
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const echo = initEcho(user);
    const channel = echo.private(`users.${user.id}`); // backend must broadcast to this channel
    channel.notification((notification) => {
      setItems(prev => [notification, ...prev]);
    });
    return () => {
      channel.stopListening('.App\\Notifications\\*');
      echo.leave(`private-users.${user.id}`);
    };
  }, [user]);
  return (
    <div>
      <h4>Notifications</h4>
      <ul>
        {items.map((n,i) => <li key={i}>{n.data?.message ?? JSON.stringify(n)}</li>)}
      </ul>
    </div>
  );
}
