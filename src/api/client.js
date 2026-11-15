// Client Axios (fichier partagé, géré par Rama)
// Utilisation : import api from '../api/client'; const { data } = await api.get('/companies');
import axios from 'axios';
import mockAdapter from './mock';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // VITE_USE_MOCK=true : réponses simulées (voir api/mock.js), le temps que le backend soit prêt
  adapter: import.meta.env.VITE_USE_MOCK === 'true' ? mockAdapter : undefined,
});

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si le token est expiré, on renvoie vers la page de connexion
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
