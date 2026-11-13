// Contexte d'authentification (fichier partagé, géré par Rama)
// Utilisation : const { user, isAdmin, login, register, logout, setUser } = useAuth();
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  // adminOnly = true depuis /admin/login (comptes admin uniquement) ;
  // false depuis /login (comptes clients uniquement). Le serveur vérifie.
  async function login(email, password, adminOnly = false) {
    const { data } = await api.post('/auth/login', { email, password, space: adminOnly ? 'admin' : 'client' });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'ADMIN', login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
