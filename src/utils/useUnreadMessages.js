// Nombre de messages non lus (pastille de l'icône Messages) (Rama)
// const count = useUnreadMessages();
// Rafraîchi toutes les 30 secondes, et tout de suite après la lecture d'une discussion
// (la page Messages appelle refreshUnread()).
import { useEffect, useState } from 'react';
import api from '../api/client';

let count = 0;
const subscribers = new Set();

export function refreshUnread() {
  return api.get('/messages/unread')
    .then(({ data }) => {
      count = data.count || 0;
      subscribers.forEach((fn) => fn(count));
    })
    .catch(() => {});
}

export default function useUnreadMessages() {
  const [value, setValue] = useState(count);
  useEffect(() => {
    subscribers.add(setValue);
    refreshUnread();
    const timer = setInterval(refreshUnread, 30000);
    return () => {
      subscribers.delete(setValue);
      clearInterval(timer);
    };
  }, []);
  return value;
}
